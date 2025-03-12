const db = require("../db/connection");
//const { checkValueExists } = require("../db/seeds/utils");

exports.fetchAllArticles = async (queries) => {
  const keyOfQueries = Object.keys(queries);
  const valuesOfQueries = Object.values(queries);

  const allowedKeys = ["order", "sort_by"];
  const forbiddenColumnsForSorting = [
    "author",
    "article_img_url",
    "topic",
    "title",
  ];

  if (keyOfQueries.length > 0) {
    if (
      keyOfQueries.every((element) => {
        return allowedKeys.includes(element);
      })
    ) {
      let queryStr =
        "SELECT articles.author, articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS article_comments FROM  articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ";
      if (
        keyOfQueries[0] === "sort_by" &&
        keyOfQueries[1] === "order" &&
        !forbiddenColumnsForSorting.includes(valuesOfQueries[0])
      ) {
        queryStr += `ORDER BY articles.${valuesOfQueries[0]} ${valuesOfQueries[1]}`;
      }
      if (
        keyOfQueries[0] === "sort_by" &&
        keyOfQueries.length === 1 &&
        !forbiddenColumnsForSorting.includes(valuesOfQueries[0])
      ) {
        queryStr += `ORDER BY articles.${valuesOfQueries[0]} DESC `;
      }
      console.log(valuesOfQueries[0]);
      if (
        keyOfQueries[0] === "sort_by" &&
        forbiddenColumnsForSorting.includes(valuesOfQueries[0])
      ) {
        return Promise.reject({
          status: 400,
          msg: `Sorting for the column ${valuesOfQueries[0]} unavailable`,
        });
      }
      return db.query(queryStr).then(({ rows }) => {
        return rows;
      });
    } else {
      return Promise.reject({ status: 400, msg: "Invalid query parameter" });
    }
  } else {
    return db
      .query(
        `SELECT articles.author, articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS article_comments FROM  articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at desc`
      )
      .then(({ rows }) => {
        return rows;
      });
  }
};
