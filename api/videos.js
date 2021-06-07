const router = require("express").Router();
const multer = require("multer");
const crypto = require("crypto");
const express = require("express");
const { generateAuthToken, requireAuthentication } = require("../lib/auth");
const mysqlPool = require("../lib/mysqlPool");

const {
  insertNewVideo,
  getVideoInfoById,
  deleteVideosById,
} = require("../models/video");

const acceptedFileTypes = {
  "video/mp4": "mp4",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: `${__dirname}/uploads`,
    filename: (req, file, callback) => {
      const filename = crypto.pseudoRandomBytes(16).toString("hex");
      const extension = acceptedFileTypes[file.mimetype];
      callback(null, `${filename}.${extension}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    callback(null, !!acceptedFileTypes[file.mimetype]);
  },
});
console.log("second ", `${__dirname}/uploads`);

router.post("/", upload.single("videoFile"), async (req, res) => {
  console.log("== req.body:", req.body);
  console.log("== req.file:", req.file);
  if (
    req.file &&
    req.body &&
    req.body.videoId &&
    req.body.postId &&
    req.body.userId
  ) {
    const video = {
      contentType: req.file.mimetype,
      filename: req.file.filename,
      url: `/videos/media/videos/${req.file.filename}`,
      videoId: parseInt(req.body.videoId),
      postId: parseInt(req.body.postId),
      userId: parseInt(req.body.userId),
    };
    try {
      // const id = await insertNewPhoto(req.body);
      const id = await insertNewVideo(video);
      console.log(id);
      res.status(200).send({
        id: id,
        videoURL: `/videos/${id}`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error inserting photo into DB.  Please try again later.",
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid video object",
    });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const video = await getVideoInfoById(parseInt(req.params.id));
    if (video) {
      res.status(200).send(video);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch video.  Please try again later.",
    });
  }
});

router.delete("/:id", requireAuthentication, async (req, res, next) => {
  const [results] = await mysqlPool.query("SELECT * FROM videos WHERE id = ?", [
    req.params.id,
  ]);
  if (req.user != results[0].userId) {
    res.status(403).send({
      error: "Unauthorized to access the specified resource",
    });
  } else {
    try {
      const deleteSuccessful = await deleteVideosById(parseInt(req.params.id));
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to delete comment.  Please try again later.",
      });
    }
  }
});

router.use("/media/videos", express.static(`${__dirname}/uploads`));

console.log(`${__dirname}/uploads`);
module.exports = router;
