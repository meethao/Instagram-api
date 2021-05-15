/*
 * Comment schema and data accessor methods.
 */

const mysqlPool = require('../lib/mysqlPool');
const { extractValidFields } = require('../lib/validation');

/*
 * Schema describing required/optional fields of a review object.
 */
const CommentSchema = {
    commentId: { required: true },
    userId: { required: true },
    postId: { required: true },
    review: { required: true }
};
exports.CommentSchema = CommentSchema;


/*
 * Executes a MySQL query to fetch the total number of comments.  Returns
 * a Promise that resolves to this count.
 */
async function getCommentsCount() {
  const [ results ] = await mysqlPool.query(
    'SELECT COUNT(*) AS count FROM comments'
  );
  return results[0].count;
}

/*
 * Executes a MySQL query to return a single page of comments.  Returns a
 * Promise that resolves to an array containing the fetched page of comments.
 */
async function getCommentsPage(page) {
  /*
   * Compute last page number and make sure page is within allowed bounds.
   * Compute offset into collection.
   */
  const count = await getCommentsCount();
  const pageSize = 10;
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  const [ results ] = await mysqlPool.query(
    'SELECT * FROM comments ORDER BY id LIMIT ?,?',
    [ offset, pageSize ]
  );

  return {
    comments: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
}
exports.getCommentsPage = getCommentsPage;


/*
 * Executes a MySQL query to get all comments from the database. Check the new id whether 
 * in the database. If the new commentId in the database, return error message. If not, 
 * return a Promise that resolves to the ID of the newly-created comment entry.
 */
async function checkCommentId(newId){
  const [ comments ] = await mysqlPool.query(
    'SELECT * FROM comments ORDER BY id'
  );

  if(comments){
    for(var i = 0; i < comments.length; i++){
      if(comments[i].commentId === newId){
        return false;
      }
    }
  }
  return true;
}
exports.checkCommentId = checkCommentId;


/*
* Executes a MySQL query to insert a new comment into the database.  Returns
* a Promise that resolves to the ID of the newly-created comment entry.
*/
async function insertNewComment(comment) {
  comment = extractValidFields(comment, CommentSchema);
  const [ result ] = await mysqlPool.query(
    'INSERT INTO comments SET ?',
    comment
  );

  return result.insertId;
}
exports.insertNewComment = insertNewComment;


/*
* Executes a MySQL query to fetch information about a single specified
* comment based on its ID. Returns a Promise that resolves to an object containing
* information about the requested comment.  If no like with the
* specified ID exists, the returned Promise will resolve to null.
*/
async function getCommentById(id) {
  const [ results ] = await mysqlPool.query(
    'SELECT * FROM comments WHERE commentId = ?',
    [ id ]
  );
  return results[0];
}
exports.getCommentById = getCommentById;


  /*
 * Executes a MySQL query to replace a specified comment with new data.
 * Returns a Promise that resolves to true if the comment specified by
 * `id` existed and was successfully updated or to false otherwise.
 */
  async function replaceCommentById(id, comment) {
    comment = extractValidFields(comment, CommentSchema);
    const [ result ] = await mysqlPool.query(
      'UPDATE comments SET ? WHERE commentId = ?',
      [ comment, id ]
    );
    return result.affectedRows > 0;
  }
  exports.replaceCommentById = replaceCommentById;


/*
* Executes a MySQL query to delete a comment specified by its ID.  Returns
* a Promise that resolves to true if the comment specified by `id` existed
* and was successfully deleted or to false otherwise.
*/
async function deleteCommentById(id) {
  const [ result ] = await mysqlPool.query(
    'DELETE FROM comments WHERE commentId = ?',
    [ id ]
  );
  return result.affectedRows > 0;
}
exports.deleteCommentById = deleteCommentById;


/*
* Executes a MySQL query to fetch all comments by a specified post, based on
* on the post's ID.  Returns a Promise that resolves to an array containing
* the requested posts.  This array could be empty if the specified post
* does not have any posts.  This function does not verify that the specified
* post ID corresponds to a valid post.
*/
async function getCommentsByPostId(id) {
  const [ results ] = await mysqlPool.query(
    'SELECT * FROM comments WHERE postId = ?',
    [ id ]
  );
  return results;
}
exports.getCommentsByPostId = getCommentsByPostId;  


/*
* Executes a MySQL query to delete a comment specified by post ID.  Returns
* a Promise that resolves to true if the comment specified by `id` existed
* and was successfully deleted or to false otherwise.
*/
async function deleteCommentsByPostId(id){
  const [ result ] = await mysqlPool.query(
    'DELETE FROM comments WHERE postId = ?',
    [ id ]
  );
  return result.affectedRows > 0;
}
exports.deleteCommentsByPostId = deleteCommentsByPostId;