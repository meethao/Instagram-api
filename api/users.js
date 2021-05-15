const router = require('express').Router();

const { validateAgainstSchema }  = require('../lib/validation');
const {
    UserSchema,
    getUsersPage,
    checkUserId,
    insertNewUser,
    getUserDetailsById,
    replaceUserById,
    deleteUserById
} = require('../models/users');


/*
 * Route to return a paginated list of users.
 */
router.get('/', async (req, res) => {
    try {
      /*
       * Fetch page info, generate HATEOAS links for surrounding pages and then
       * send response.
       */
      const userPage = await getUsersPage(parseInt(req.query.page) || 1);
      userPage.links = {};
      if (userPage.page < userPage.totalPages) {
        userPage.links.nextPage = `/users?page=${userPage.page + 1}`;
        userPage.links.lastPage = `/users?page=${userPage.totalPages}`;
      }
      if (userPage.page > 1) {
        userPage.links.prevPage = `/users?page=${userPage.page - 1}`;
        userPage.links.firstPage = '/users?page=1';
      }
      res.status(200).send(userPage);
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error fetching users list.  Please try again later."
      });
    }
  });


/*
 * Route to create a new user.
 */
router.post('/', async (req, res) => {
    if(await checkUserId(req.body.userId)){
      if (validateAgainstSchema(req.body, UserSchema)) {
        try {
          const id = await insertNewUser(req.body);
          res.status(201).send({
            id: id,
            links: {
              user: `/users/${id}`
            }
          });
        } catch (err) {
          console.error(err);
          res.status(500).send({
            error: "Error inserting user into DB.  Please try again later."
          });
        }
      } else {
        res.status(400).send({
          error: "Request body is not a valid user object."
        });
      }
    }else{
      res.status(500).send({
          error: "There is a user which has a same user id.  Please change user id."
      });
    }
  });


/*
 * Route to fetch info about a specific user.
 */
router.get('/:id', async (req, res, next) => {
    try {
      const user = await getUserDetailsById(parseInt(req.params.id));
      if (user) {
        res.status(200).send(user);
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to fetch user.  Please try again later."
      });
    }
});


/*
 * Route to replace data for a user.
 */
router.put('/:id', async (req, res, next) => {
  const id = parseInt(req.params.id)
    if(id === req.body.userId){
      if (validateAgainstSchema(req.body, UserSchema)) {
        try {
          const updateSuccessful = await replaceUserById(id, req.body);
          if (updateSuccessful) {
            res.status(200).send({
              links: {
                user: `/users/${id}`
              }
            });
          } else {
            next();
          }
        } catch (err) {
          console.error(err);
          res.status(500).send({
            error: "Unable to update specified user.  Please try again later."
          });
        }
      } else {
        res.status(400).send({
          error: "Request body is not a valid user object"
        });
      }
    }else{
      res.status(500).send({
        error: "Unable to update specified user. Because can not change the user id."
      });
    }
  });
  
  
  /*
   * Route to delete a user.
   */
  router.delete('/:id', async (req, res, next) => {
    try {
      const deleteSuccessful = await deleteUserById(parseInt(req.params.id));
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to delete user.  Please try again later."
      });
    }
  });


exports.router = router;