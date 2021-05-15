/*
 * User schema and data accessor methods.
 */

const mysqlPool = require('../lib/mysqlPool');
const { extractValidFields } = require('../lib/validation');
const { getPostsByUserId } = require('./posts');
const { deletePostsByUserId } = require('./posts');


/*
 * Schema describing required/optional fields of a review object.
 */
const UserSchema = {
    userId: { required: true },
    userName: { required: true },
    userPassword: { required: true },
    email: { required: false }
};
exports.UserSchema = UserSchema;


/*
 * Executes a MySQL query to fetch the total number of users.  Returns
 * a Promise that resolves to this count.
 */
async function getUsersCount() {
    const [ results ] = await mysqlPool.query(
      'SELECT COUNT(*) AS count FROM users'
    );
    return results[0].count;
  }
  
  /*
   * Executes a MySQL query to return a single page of users.  Returns a
   * Promise that resolves to an array containing the fetched page of users.
   */
  async function getUsersPage(page) {
    /*
     * Compute last page number and make sure page is within allowed bounds.
     * Compute offset into collection.
     */
    const count = await getUsersCount();
    const pageSize = 10;
    const lastPage = Math.ceil(count / pageSize);
    page = page > lastPage ? lastPage : page;
    page = page < 1 ? 1 : page;
    const offset = (page - 1) * pageSize;
  
    const [ results ] = await mysqlPool.query(
      'SELECT * FROM users ORDER BY id LIMIT ?,?',
      [ offset, pageSize ]
    );
  
    return {
      users: results,
      page: page,
      totalPages: lastPage,
      pageSize: pageSize,
      count: count
    };
  }
  exports.getUsersPage = getUsersPage;


/*
 * Executes a MySQL query to get all users from the database. Check the new id whether 
 * in the database. If the new userId in the database, return error message. If not, 
 * return a Promise that resolves to the ID of the newly-created user entry.
 */
async function checkUserId(newId){
  const [ users ] = await mysqlPool.query(
    'SELECT * FROM users ORDER BY id'
  );

  if(users){
    for(var i = 0; i < users.length; i++){
      if(users[i].userId === newId){
        return false;
      }
    }
  }
  return true;
}
exports.checkUserId = checkUserId;


/*
 * Executes a MySQL query to insert a new user into the database.  Returns
 * a Promise that resolves to the ID of the newly-created user entry.
 */
async function insertNewUser(user) {
    user = extractValidFields(user, UserSchema);
    const [ result ] = await mysqlPool.query(
      'INSERT INTO users SET ?',
      user
    );
  
    return result.insertId;
  }
  exports.insertNewUser = insertNewUser;


/*
 * Executes a MySQL query to fetch information about a single specified
 * user based on its ID.  Does not fetch post, comment, and like data for the
 * users.  Returns a Promise that resolves to an object containing
 * information about the requested user.  If no user with the
 * specified ID exists, the returned Promise will resolve to null.
 */
async function getUserByUserId(id) {
    const [ results ] = await mysqlPool.query(
      'SELECT * FROM users WHERE userId = ?',
      [ id ]
    );
    return results[0];
  }
  
  /*
   * Executes a MySQL query to fetch detailed information about a single
   * specified users based on its ID, including post, comment and like data for
   * the users.  Returns a Promise that resolves to an object containing
   * information about the requested users.  If no users with the
   * specified ID exists, the returned Promise will resolve to null.
   */
  async function getUserDetailsById(id) {
    /*
     * Execute three sequential queries to get all of the info about the
     * specified user, including its posts, comments and likes.
     */
    const users = await getUserByUserId(id);
    
    if (users) {
      users.posts = await getPostsByUserId(id);
    }
    return users;
  }
  exports.getUserDetailsById = getUserDetailsById;


  /*
 * Executes a MySQL query to replace a specified users with new data.
 * Returns a Promise that resolves to true if the users specified by
 * `id` existed and was successfully updated or to false otherwise.
 */
async function replaceUserById(id, users) {
    users = extractValidFields(users, UserSchema);
    const [ result ] = await mysqlPool.query(
      'UPDATE users SET ? WHERE id = ?',
      [ users, id ]
    );
    return result.affectedRows > 0;
  }
  exports.replaceUserById = replaceUserById;
  

  /*
   * Executes a MySQL query to delete a users specified by its ID.  Returns
   * a Promise that resolves to true if the users specified by `id` existed
   * and was successfully deleted or to false otherwise.
   */
  async function deleteUserById(id) {
    posts = await deletePostsByUserId(id);

    const [ result ] = await mysqlPool.query(
      'DELETE FROM users WHERE userId = ?',
      [ id ]
    );
    return result.affectedRows > 0;
  }
  exports.deleteUserById = deleteUserById;
  