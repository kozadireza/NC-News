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

exports.createArticleComment = async (author, body, id) => {
  const checkValueIsExisting = await checkValueExists(
    "articles",
    "article_id",
    id
  );
  console.log(typeof body);
  if (!checkValueIsExisting) {
    console.log(author, body, id);
    return db
      .query(
        `INSERT INTO comments (author, body, article_id)
        VALUES ($1, $2, $3) RETURNING *;`,
        [author, body, id]
      )
      .then(({ rows }) => {
        if (rows.length > 0) {
          console.log(rows);
          return rows;
        } else {
          return Promise.reject({ status: 404, msg: "comments not found" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    return Promise.reject({ status: 404, msg: "article_id not found" });
  }
};
