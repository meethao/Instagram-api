const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const {
    PostSchema,
    getPostsPage,
    getPostDetailsById,
    checkPostId,
    insertNewPost,
    replacePostById,
    deletePostById
} = require('../models/posts');


/*
 * Route to return a paginated list of posts.
 */
router.get('/', async (req, res) => {
    try {
      /*
       * Fetch page info, generate HATEOAS links for surrounding pages and then
       * send response.
       */
      const postsPage = await getPostsPage(parseInt(req.query.page) || 1);
      postsPage.links = {};
      if (postsPage.page < postsPage.totalPages) {
        postsPage.links.nextPage = `/posts?page=${postsPage.page + 1}`;
        postsPage.links.lastPage = `/posts?page=${postsPage.totalPages}`;
      }
      if (postsPage.page > 1) {
        postsPage.links.prevPage = `/posts?page=${postsPage.page - 1}`;
        postsPage.links.firstPage = '/posts?page=1';
      }
      res.status(200).send(postsPage);
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error fetching posts list.  Please try again later."
      });
    }
  });


/*
 * Route to create a new post.
 */
router.post('/', async (req, res) => {
  if(await checkPostId(req.body.postId)){
    if (validateAgainstSchema(req.body, PostSchema)) {
      try {
        const id = await insertNewPost(req.body);
        res.status(201).send({
          id: id,
          links: {
            post: `/posts/${id}`
          }
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Error inserting post into DB.  Please try again later."
        });
      }
    } else {
      res.status(400).send({
        error: "Request body is not a valid post object."
      });
    }
  }else{
    res.status(500).send({
      error: "There is a post which has a same user id.  Please change user id."
  });
  }
    
  });


/*
 * Route to fetch info about a specific post.
 */
router.get('/:id', async (req, res, next) => {
    try {
      const post = await getPostDetailsById(parseInt(req.params.id));
      if (post) {
        res.status(200).send(post);
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to fetch post.  Please try again later."
      });
    }
  });


/*
 * Route to replace data for a post.
 */
router.put('/:id', async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (id === req.body.postId){
    if (validateAgainstSchema(req.body, PostSchema)) {
      try {
        
        const updateSuccessful = await replacePostById(id, req.body);
        if (updateSuccessful) {
          res.status(200).send({
            links: {
              post: `/posts/${id}`
            }
          });
        } else {
          next();
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Unable to update specified post.  Please try again later."
        });
      }
    } else {
      res.status(400).send({
        error: "Request body is not a valid post object"
      });
    }
  }
  else{
    res.status(500).send({
      error: "Unable to update specified post. Can not change the post id."
    });
  }
});


/*
 * Route to delete a post.
 */
router.delete('/:id', async (req, res, next) => {
    try {
      const deleteSuccessful = await deletePostById (parseInt(req.params.id));
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to delete post.  Please try again later."
      });
    }
  });









exports.router = router;