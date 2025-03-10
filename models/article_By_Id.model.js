const db = require("../db/connection");
const { checkValueExists } = require("../db/seeds/utils");

exports.fetchArticleById = async (id) => {
  const checkValueIsExisting = await checkValueExists(
    "articles",
    "article_id",
    id
  );
  if (!checkValueIsExisting) {
    return db
      .query(`SELECT * from articles WHERE article_id = $1`, [id])
      .then(({ rows }) => {
        return rows[0];
      });
  } else {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
};
