/*
 * Like schema and data accessor methods.
 */

const mysqlPool = require("../lib/mysqlPool");
const { extractValidFields } = require("../lib/validation");

/*
 * Schema describing required/optional fields of a review object.
 */
const LikeSchema = {
  likeId: { required: true },
  userId: { required: true },
  postId: { required: true },
  like_post: { required: true },
};
exports.LikeSchema = LikeSchema;

/*
 * Executes a MySQL query to fetch the total number of likes.  Returns
 * a Promise that resolves to this count.
 */
async function getLikesCount() {
  const [results] = await mysqlPool.query(
    "SELECT COUNT(*) AS count FROM likes"
  );
  return results[0].count;
}

/*
 * Executes a MySQL query to return a single page of likes.  Returns a
 * Promise that resolves to an array containing the fetched page of likes.
 */
async function getLikesPage(page) {
  /*
   * Compute last page number and make sure page is within allowed bounds.
   * Compute offset into collection.
   */
  const count = await getLikesCount();
  const pageSize = 10;
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  const [results] = await mysqlPool.query(
    "SELECT * FROM likes ORDER BY id LIMIT ?,?",
    [offset, pageSize]
  );

  return {
    likes: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count,
  };
}
exports.getLikesPage = getLikesPage;

/*
 * Executes a MySQL query to get all likes from the database. Check the new id and use id whether
 * in the database. One user can’t like a post more than once.
 */
async function checkLikesId(newId) {
  const [likes] = await mysqlPool.query("SELECT * FROM likes ORDER BY id");

  if (likes) {
    for (var i = 0; i < likes.length; i++) {
      if (likes[i].likeId === newId) {
        return false;
      }
    }
  }
  return true;
}
exports.checkLikesId = checkLikesId;

async function checkUserPostId(user_id, post_id) {
  const [likes] = await mysqlPool.query("SELECT * FROM likes ORDER BY id");

  if (likes) {
    for (var i = 0; i < likes.length; i++) {
      if (likes[i].userId === user_id && likes[i].postId === post_id) {
        return false;
      }
    }
  }
  return true;
}
exports.checkUserPostId = checkUserPostId;

/*
 * Executes a MySQL query to insert a new like into the database.  Returns
 * a Promise that resolves to the ID of the newly-created like entry.
 */
async function insertNewLike(like) {
  like = extractValidFields(like, LikeSchema);
  console.log("v!!! ", like);
  const [result] = await mysqlPool.query("INSERT INTO likes SET ?", like);

  return result.insertId;
}
exports.insertNewLike = insertNewLike;

/*
 * Executes a MySQL query to fetch information about a single specified
 * like based on its ID.  Does not fetch photo and review data for the
 * like.  Returns a Promise that resolves to an object containing
 * information about the requested like.  If no like with the
 * specified ID exists, the returned Promise will resolve to null.
 */
async function getLikeById(id) {
  const [results] = await mysqlPool.query("SELECT * FROM likes WHERE id = ?", [
    id,
  ]);
  return results[0];
}
exports.getLikeById = getLikeById;

/*
 * Executes a MySQL query to delete a like specified by its ID.  Returns
 * a Promise that resolves to true if the like specified by `id` existed
 * and was successfully deleted or to false otherwise.
 */
async function deleteLikeById(id) {
  const [result] = await mysqlPool.query("DELETE FROM likes WHERE likeId = ?", [
    id,
  ]);
  return result.affectedRows > 0;
}
exports.deleteLikeById = deleteLikeById;

/*
 * Executes a MySQL query to fetch all likes by a specified post, based on
 * on the post's ID.  Returns a Promise that resolves to an array containing
 * the requested posts.  This array could be empty if the specified post
 * does not have any posts.  This function does not verify that the specified
 * post ID corresponds to a valid post.
 */
async function getLikesByPostId(id) {
  const [results] = await mysqlPool.query(
    "SELECT * FROM likes WHERE postId = ?",
    [id]
  );
  return results;
}
exports.getLikesByPostId = getLikesByPostId;

deleteLikesByPostId;
/*
 * Executes a MySQL query to delete a like specified by post ID.  Returns
 * a Promise that resolves to true if the like specified by `id` existed
 * and was successfully deleted or to false otherwise.
 */
async function deleteLikesByPostId(id) {
  const [result] = await mysqlPool.query("DELETE FROM likes WHERE postId = ?", [
    id,
  ]);
  return result.affectedRows > 0;
}
exports.deleteLikesByPostId = deleteLikesByPostId;
