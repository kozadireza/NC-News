const db = require("../db/connection");

exports.fetchAllArticles = async (queries) => {
  const keyOfQueries = Object.keys(queries);
  const valuesOfQueries = Object.values(queries);

  const allowedKeys = ["order", "sort_by", "topic"];
  const nonSortableColumns = ["author", "article_img_url", "topic", "title"];
  //query's conditions
  const isSortByAndOrderProvided =
    keyOfQueries[0] === "sort_by" && keyOfQueries[1] === "order";

  const justSortByProvided =
    keyOfQueries[0] === "sort_by" && keyOfQueries.length === 1;
  const justOrderProvided =
    keyOfQueries[0] === "order" && keyOfQueries.length === 1;

  const isSortColumnValid = !nonSortableColumns.includes(valuesOfQueries[0]);

  if (keyOfQueries.length > 0 && !(valuesOfQueries[0] == "")) {
    if (
      keyOfQueries.every((element) => {
        return allowedKeys.includes(element);
      })
    ) {
      let inputValues = [];
      let queryStr =
        "SELECT articles.author, articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS article_comments FROM  articles LEFT JOIN comments ON articles.article_id = comments.article_id ";

      if (keyOfQueries[0] === "topic") {
        queryStr += `WHERE articles.topic = $1 `;
        inputValues.push(valuesOfQueries[0]);
      }

      queryStr += `GROUP BY articles.article_id `;

      if (isSortByAndOrderProvided && isSortColumnValid) {
        queryStr += `ORDER BY articles.${valuesOfQueries[0]} ${valuesOfQueries[1]} `;
      }
      if (justSortByProvided && isSortColumnValid) {
        queryStr += `ORDER BY articles.${valuesOfQueries[0]} DESC `;
      }
      if (justOrderProvided && isSortColumnValid) {
        queryStr += `ORDER BY articles.created_at ${valuesOfQueries[0]} `;
      }
      if (
        (isSortByAndOrderProvided || justSortByProvided) &&
        !isSortColumnValid
      ) {
        return Promise.reject({
          status: 400,
          msg: `Sorting for the column ${valuesOfQueries[0]} unavailable`,
        });
      }
      if (!queryStr.includes("ORDER BY")) {
        queryStr += `ORDER BY created_at desc `;
      }
      if (inputValues.length === 0) {
        return db.query(queryStr).then(({ rows }) => {
          return rows;
        });
      } else {
        return db.query(queryStr, inputValues).then(({ rows }) => {
          if (rows.length === 0) {
            return Promise.reject({
              status: 404,
              msg: `${inputValues[0]} not found`,
            });
          } else {
            return rows;
          }
        });
      }
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
