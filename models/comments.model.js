const db = require("../db/connection");
const { checkValueExists } = require("../db/seeds/utils");

exports.fetchArticleComments = async (id) => {
  const checkValueIsExisting = await checkValueExists(
    "articles",
    "article_id",
    id
  );
  if (!checkValueIsExisting) {
    return db
      .query(
        `SELECT * from comments WHERE article_id = $1 ORDER BY created_at DESC`,
        [id]
      )
      .then(({ rows }) => {
        if (rows.length > 0) {
          return rows;
        } else {
          return Promise.reject({ status: 404, msg: "comments not found" });
        }
      });
  } else {
    return Promise.reject({ status: 404, msg: "article_id not found" });
  }
};
