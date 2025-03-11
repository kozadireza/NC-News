const db = require("../db/connection");
const { checkValueExists } = require("../db/seeds/utils");

exports.removeCommentById = async (id) => {
  const checkValueIsExisting = await checkValueExists(
    "comments",
    "comment_id",
    Number(id)
  );

  if (!checkValueIsExisting) {
    return db
      .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
        Number(id),
      ])
      .then(({ rows }) => {
        return rows[0];
      });
  } else {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
};
