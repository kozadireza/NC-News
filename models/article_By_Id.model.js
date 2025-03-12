const db = require("../db/connection");
const { checkValueExists } = require("../db/seeds/utils");

exports.fetchArticleById = async (id) => {
  const checkValueIsExisting = await checkValueExists(
    "articles",
    "article_id",
    id
  );
  console.log(id);
  if (!checkValueIsExisting) {
    return db
      .query(
        `SELECT articles.author, articles.body, articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM  articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id ORDER BY created_at desc`,
        [id]
      )
      .then(({ rows }) => {
        //console.log(rows);
        return rows[0];
      });
  } else {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
};

exports.updateArticleById = async (updatingData, id) => {
  const checkValueIsExisting = await checkValueExists(
    "articles",
    "article_id",
    id
  );
  if (!checkValueIsExisting) {
    return db
      .query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
        [updatingData, id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  } else {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
};

`SELECT articles.author, articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS article_comments FROM  articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at desc`;
