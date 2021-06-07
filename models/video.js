const mysqlPool = require("../lib/mysqlPool");
const { extractValidFields } = require("../lib/validation");

const videoSchema = {
  videoId: { required: true },
  postId: { required: true },
  userId: { required: true },
  filename: { required: true },
  url: { required: true },
  contentType: { required: true },
};
exports.videoSchema = videoSchema;

async function getVideoInfoById(id) {
  const [results] = await mysqlPool.query("SELECT * FROM videos WHERE id = ?", [
    id,
  ]);
  return results[0];
}
exports.getVideoInfoById = getVideoInfoById;

async function getVideoInfoByPostId(id) {
  const [results] = await mysqlPool.query(
    "SELECT * FROM videos WHERE postId = ?",
    [id]
  );
  return results;
}
exports.getVideoInfoByPostId = getVideoInfoByPostId;

async function insertNewVideo(video) {
  video = extractValidFields(video, videoSchema);
  const [result] = await mysqlPool.query("INSERT INTO videos SET ?", video);
  return result.insertId;
}
exports.insertNewVideo = insertNewVideo;

async function deleteVideosById(id) {
  const [result] = await mysqlPool.query("DELETE FROM videos WHERE id = ?", [
    id,
  ]);
  return result.affectedRows > 0;
}
exports.deleteVideosById = deleteVideosById;
