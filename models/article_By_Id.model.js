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
  const key = Object.keys(updatingData)[0];
  const inc_votes = updatingData[key];

  if (key && inc_votes) {
    return db
      .query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
        [inc_votes, id]
      )
      .then(({ rows }) => {
        if (rows.length > 0) {
          return rows[0];
        } else {
          return Promise.reject({ status: 404, msg: "article_id not found" });
        }
      });
  } else {
    return Promise.reject({
      status: 400,
      msg: "Not enough data for updating article",
    });
  }
};

exports.removeArticleById = (id) => {
  return db
    .query(`DELETE FROM articles WHERE article_id = $1 RETURNING *`, [
      Number(id),
    ])
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "article_id not found" });
      }
    });
};
