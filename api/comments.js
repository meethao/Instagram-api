const router = require("express").Router();

const { validateAgainstSchema } = require("../lib/validation");
const { generateAuthToken, requireAuthentication } = require("../lib/auth");
const mysqlPool = require("../lib/mysqlPool");
const {
  CommentSchema,
  getCommentsPage,
  insertNewComment,
  getCommentById,
  replaceCommentById,
  deleteCommentById,
  checkCommentId,
} = require("../models/comments");

/*
 * Route to return a paginated list of comments.
 */
router.get("/", async (req, res) => {
  try {
    /*
     * Fetch page info, generate HATEOAS links for surrounding pages and then
     * send response.
     */
    const commentPage = await getCommentsPage(parseInt(req.query.page) || 1);
    commentPage.links = {};
    if (commentPage.page < commentPage.totalPages) {
      commentPage.links.nextPage = `/comments?page=${commentPage.page + 1}`;
      commentPage.links.lastPage = `/comments?page=${commentPage.totalPages}`;
    }
    if (commentPage.page > 1) {
      commentPage.links.prevPage = `/comments?page=${commentPage.page - 1}`;
      commentPage.links.firstPage = "/comments?page=1";
    }
    res.status(200).send(commentPage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching comments list.  Please try again later.",
    });
  }
});

/*
 * Route to create a new comment.
 */
router.post("/", requireAuthentication, async (req, res) => {
  if (req.user != req.body.userId) {
    res.status(403).send({
      error: "Unauthorized to access the specified resource",
    });
  }
  if (await checkCommentId(req.body.commentId)) {
    if (validateAgainstSchema(req.body, CommentSchema)) {
      try {
        const id = await insertNewComment(req.body);
        res.status(201).send({
          id: id,
          links: {
            comment: `/comments/${id}`,
          },
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Error inserting comment into DB.  Please try again later.",
        });
      }
    } else {
      res.status(400).send({
        error: "Request body is not a valid comment object.",
      });
    }
  } else {
    res.status(500).send({
      error: "Error inserting comment into DB.  There is a same comment id.",
    });
  }
});

/*
 * Route to fetch info about a specific comment.
 */
router.get("/:id", async (req, res, next) => {
  try {
    const like = await getCommentById(parseInt(req.params.id));
    if (like) {
      res.status(200).send(like);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch comment.  Please try again later.",
    });
  }
});

/*
 * Route to replace data for a comment.
 */
router.put("/:id", requireAuthentication, async (req, res, next) => {
  if (req.user != req.body.userId) {
    res.status(403).send({
      error: "Unauthorized to access the specified resource",
    });
  } else {
    try {
      const id = parseInt(req.params.id);
      const updateSuccessful = await replaceCommentById(id, req.body);
      if (updateSuccessful) {
        res.status(200).send({
          links: {
            comment: `/comments/${id}`,
          },
        });
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to update specified comment.  Please try again later.",
      });
    }
  }
});

/*
 * Route to delete a comment.
 */
router.delete("/:id", requireAuthentication, async (req, res, next) => {
  const [results] = await mysqlPool.query(
    "SELECT * FROM comments WHERE id = ?",
    [req.params.id]
  );
  if (req.user != results[0].userId) {
    res.status(403).send({
      error: "Unauthorized to access the specified resource",
    });
  } else {
    try {
      const deleteSuccessful = await deleteCommentById(parseInt(req.params.id));
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

module.exports = router;
