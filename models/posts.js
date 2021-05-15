/*
 * Post schema and data accessor methods.
 */

const mysqlPool = require('../lib/mysqlPool');
const { extractValidFields } = require('../lib/validation');
const { 
  getLikesByPostId,
  deleteLikesByPostId
} = require('./likes');

const { 
  getCommentsByPostId,
  deleteCommentsByPostId
} = require('./comments');

deleteCommentsByPostId
/*
 * Schema describing required/optional fields of a post object.
 */
const PostSchema = {
    postId: { required: true },
    userId: { required: true },
    caption: { required: true }
};
exports.PostSchema = PostSchema;


/*
 * Executes a MySQL query to fetch the total number of posts.  Returns
 * a Promise that resolves to this count.
 */
async function getPostsCount() {
    const [ results ] = await mysqlPool.query(
      'SELECT COUNT(*) AS count FROM posts'
    );
    return results[0].count;
  }
  

  /*
   * Executes a MySQL query to return a single page of posts.  Returns a
   * Promise that resolves to an array containing the fetched page of posts.
   */
  async function getPostsPage(page) {
    /*
     * Compute last page number and make sure page is within allowed bounds.
     * Compute offset into collection.
     */
    const count = await getPostsCount();
    const pageSize = 10;
    const lastPage = Math.ceil(count / pageSize);
    page = page > lastPage ? lastPage : page;
    page = page < 1 ? 1 : page;
    const offset = (page - 1) * pageSize;
  
    const [ results ] = await mysqlPool.query(
      'SELECT * FROM posts ORDER BY id LIMIT ?,?',
      [ offset, pageSize ]
    );
  
    return {
      posts: results,
      page: page,
      totalPages: lastPage,
      pageSize: pageSize,
      count: count
    };
  }
  exports.getPostsPage = getPostsPage;


/*
 * Executes a MySQL query to get all posts from the database. Check the new id whether 
 * in the database. If the new post id in the database, return error message. If not, 
 * return a Promise that resolves to the ID of the newly-created user entry.
 */
async function checkPostId(newId){
  const [ posts ] = await mysqlPool.query(
    'SELECT * FROM posts ORDER BY id'
  );

  if(posts){
    for(var i = 0; i < posts.length; i++){
      if(posts[i].postId === newId){
        return false;
      }
    }
  }
  return true;
}
exports.checkPostId = checkPostId;


/*
 * Executes a MySQL query to insert a new post into the database.  Returns
 * a Promise that resolves to the ID of the newly-created post entry.
 */
async function insertNewPost(post) {
    post = extractValidFields(post, PostSchema);
    const [ result ] = await mysqlPool.query(
      'INSERT INTO posts SET ?',
      post
    );
  
    return result.insertId;
  }
  exports.insertNewPost = insertNewPost;


  /*
 * Executes a MySQL query to fetch information about a single specified
 * post based on its ID.  Does not fetch comment and like data for the
 * post.  Returns a Promise that resolves to an object containing
 * information about the requested post.  If no post with the
 * specified ID exists, the returned Promise will resolve to null.
 */
async function getPostById(id) {
    const [ results ] = await mysqlPool.query(
      'SELECT * FROM posts WHERE postId = ?',
      [ id ]
    );
    return results[0];
  }
  
  /*
   * Executes a MySQL query to fetch detailed information about a single
   * specified post based on its ID, including comment and like data for
   * the post.  Returns a Promise that resolves to an object containing
   * information about the requested post.  If no post with the
   * specified ID exists, the returned Promise will resolve to null.
   */
  async function getPostDetailsById(id) {
    /*
     * Execute three sequential queries to get all of the info about the
     * specified post, including its comments and likes.
     */
    const post = await getPostById(id);
    
    if (post) {
      post.comments= await getCommentsByPostId(id);
      post.likes = await getLikesByPostId(id);
    }
    
    return post;
  }
  exports.getPostDetailsById = getPostDetailsById;


  /*
 * Executes a MySQL query to replace a specified post with new data.
 * Returns a Promise that resolves to true if the post specified by
 * `id` existed and was successfully updated or to false otherwise.
 */
async function replacePostById(id, post) {
    post = extractValidFields(post, PostSchema);
    const [ result ] = await mysqlPool.query(
      'UPDATE posts SET ? WHERE postId = ?',
      [ post, id ]
    );
    return result.affectedRows > 0;
  }
  exports.replacePostById = replacePostById;


  /*
 * Executes a MySQL query to delete a post specified by its ID.  Returns
 * a Promise that resolves to true if the post specified by `id` existed
 * and was successfully deleted or to false otherwise.
 */
async function deletePostById(id) {
    comments = await deleteCommentsByPostId(id);
    likes = await deleteLikesByPostId(id);

    const [ result ] = await mysqlPool.query(
      'DELETE FROM posts WHERE postId = ?',
      [ id ]
    );
    return result.affectedRows > 0;
  }
  exports.deletePostById = deletePostById;



/*
 * Executes a MySQL query to fetch all posts by a specified user, based on
 * on the user's ID.  Returns a Promise that resolves to an array containing
 * the requested posts.  This array could be empty if the specified user
 * does not have any posts.  This function does not verify that the specified
 * user ID corresponds to a valid user.
 */
async function getPostsByUserId(id) {
  const [ results ] = await mysqlPool.query(
    'SELECT * FROM posts WHERE userId = ?',
    [ id ]
  );

    if(results) {
      for(var i = 0; i < results.length; i++){
        console.log(results[i].postId);
        results[i].comments = await getCommentsByPostId(results[i].postId);
        results[i].likes = await getLikesByPostId(results[i].postId);
      }
    }
    console.log(results);
  return results;
}
exports.getPostsByUserId = getPostsByUserId;


/*
 * Executes a MySQL query to delete all posts by a specified user, based on
 * on the user's ID.  Returns a Promise that resolves to an array containing
 * the requested posts.  
 */
  async function deletePostsByUserId(id) {
    const [ posts ] = await mysqlPool.query(
      'SELECT * FROM posts WHERE userId = ?',
      [ id ]
    );
    
    console.log(posts);

    if( posts ) {
      for(var i = 0; i < posts.length; i++){
        console.log(posts[i].postId);
        posts.comments = await deleteCommentsByPostId(posts[i].postId);
        posts.likes = await deleteLikesByPostId(posts[i].postId);
      }
    }

    const [ results ] = await mysqlPool.query(
      'DELETE FROM posts WHERE userId = ?',
      [ id ]
    );
    return results.affectedRows > 0;
  }
  exports.deletePostsByUserId = deletePostsByUserId;