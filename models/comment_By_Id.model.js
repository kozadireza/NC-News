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
