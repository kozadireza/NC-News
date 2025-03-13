const db = require("../db/connection");

exports.removeCommentById = async (id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      Number(id),
    ])
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "comment_id not found" });
      }
    });
};

exports.updateCommentById = async (id, updating_info) => {
  const updatingKey = Object.keys(updating_info)[0];
  const updatingValue = updating_info[updatingKey];

  if (updatingKey && updatingValue) {
    if (Object.keys(updating_info)[0] === "inc_votes") {
      return db
        .query(
          `UPDATE comments SET votes = comments.votes + $2 WHERE comment_id = $1 RETURNING *`,
          [id, updating_info.inc_votes]
        )
        .then(({ rows }) => {
          if (rows.length > 0) {
            return rows[0];
          } else {
            return Promise.reject({ status: 404, msg: "comment_id not found" });
          }
        });
    }
  } else {
    return Promise.reject({
      status: 400,
      msg: "Not enough data for updating comment",
    });
  }
};
