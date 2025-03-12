const db = require("../db/connection");

exports.fetchArticleById = (id) => {
  return db
    .query(
      `SELECT articles.author, articles.body, articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM  articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id ORDER BY created_at desc`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "article_id not found" });
      }
    });
};

exports.updateArticleById = async (updatingData, id) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [updatingData, id]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "article_id not found" });
      }
    });
};
