const router = require("express").Router();

const { validateAgainstSchema } = require("../lib/validation");
const { generateAuthToken, requireAuthentication } = require("../lib/auth");
const mysqlPool = require("../lib/mysqlPool");
const {
  LikeSchema,
  checkLikesId,
  checkUserPostId,
  insertNewLike,
  getLikesPage,
  getLikeById,
  deleteLikeById,
} = require("../models/likes");

/*
 * Route to return a paginated list of likes.
 */
router.get("/", async (req, res) => {
  try {
    /*
     * Fetch page info, generate HATEOAS links for surrounding pages and then
     * send response.
     */
    const likePage = await getLikesPage(parseInt(req.query.page) || 1);
    likePage.links = {};
    if (likePage.page < likePage.totalPages) {
      likePage.links.nextPage = `/likes?page=${likePage.page + 1}`;
      likePage.links.lastPage = `/likes?page=${likePage.totalPages}`;
    }
    if (likePage.page > 1) {
      likePage.links.prevPage = `/likes?page=${likePage.page - 1}`;
      likePage.links.firstPage = "/likes?page=1";
    }
    res.status(200).send(likePage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching likes list.  Please try again later.",
    });
  }
});

/*
 * Route to create a new like.
 */
router.post("/", requireAuthentication, async (req, res) => {
  if (req.user != req.body.userId) {
    res.status(403).send({
      error: "Unauthorized to access the specified resource",
    });
  }
  // checkLikesId, checkUserPostId,
  if (
    (await checkLikesId(req.body.likeId)) &&
    (await checkUserPostId(req.body.userId, req.body.postId))
  ) {
    if (validateAgainstSchema(req.body, LikeSchema)) {
      try {
        const id = await insertNewLike(req.body);
        res.status(201).send({
          id: id,
          links: {
            like: `/likes/${id}`,
          },
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Error inserting like into DB.  Please try again later.",
        });
      }
    } else {
      res.status(400).send({
        error: "Request body is not a valid like object.",
      });
    }
  } else {
    res.status(500).send({
      error:
        "Error inserting like into DB. One user can’t like a post more than once.",
    });
  }
});

/*
 * Route to fetch info about a specific like.
 */
router.get("/:id", async (req, res, next) => {
  try {
    const like = await getLikeById(parseInt(req.params.id));
    if (like) {
      res.status(200).send(like);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch like.  Please try again later.",
    });
  }
});

/*
 * Route to delete a like.
 */
router.delete("/:id", requireAuthentication, async (req, res, next) => {
  const [results] = await mysqlPool.query("SELECT * FROM likes WHERE id = ?", [
    req.params.id,
  ]);
  if (req.user != results[0].userId) {
    res.status(403).send({
      error: "Unauthorized to access the specified resource",
    });
  } else {
    try {
      const deleteSuccessful = await deleteLikeById(parseInt(req.params.id));
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to delete like.  Please try again later.",
      });
    }
  }
});

module.exports = router;
