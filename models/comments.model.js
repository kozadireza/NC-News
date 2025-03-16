const db = require("../db/connection");
const { checkValueExists } = require("../db/seeds/utils");

exports.fetchArticleComments = async (queries, id) => {
  const keyOfQueries = Object.keys(queries);
  const valuesOfQueries = Object.values(queries);

  //LIMIT CONDITIONS
  const isFullPagination =
    keyOfQueries[0] === "limit" && keyOfQueries[1] === "p";
  const isDefaultPagination =
    keyOfQueries.length === 1 && keyOfQueries[0] === "p";

  const checkValueIsExisting = await checkValueExists(
    "articles",
    "article_id",
    id
  );

  if (!checkValueIsExisting) {
    if (keyOfQueries.length > 0) {
      let queryStr = `SELECT * from comments WHERE article_id = $1 ORDER BY created_at DESC `;
      let inputValues = [id];
      let dollarSign = 2;
      if (isDefaultPagination) {
        const offset = (Number(valuesOfQueries[0]) - 1) * 10;
        queryStr += `LIMIT 10 OFFSET ${offset} `;
      }
      if (isFullPagination) {
        const offset =
          (Number(valuesOfQueries[1]) - 1) * Number(valuesOfQueries[0]);

        queryStr += `LIMIT ${"$"}${dollarSign} OFFSET ${offset} `;
        inputValues.push(Number(valuesOfQueries[0]));
      }

      return db.query(queryStr, inputValues).then(({ rows }) => {
        return rows;
      });
    } else {
      return db
        .query(
          `SELECT * from comments WHERE article_id = $1 ORDER BY created_at DESC LIMIT 10 OFFSET 0`,
          [id]
        )
        .then(({ rows }) => {
          return rows;
        });
    }
  } else {
    return Promise.reject({ status: 404, msg: "article_id not found" });
  }
};

exports.createArticleComment = (author, body, id) => {
  if (author && body) {
    return db
      .query(
        `INSERT INTO comments (author, body, article_id)
        VALUES ($1, $2, $3) RETURNING *;`,
        [author, body, id]
      )
      .then(({ rows }) => {
        if (rows.length > 0) {
          return rows;
        } else {
          return Promise.reject({ status: 404, msg: "article_id not found" });
        }
      });
  } else {
    return Promise.reject({ status: 400, msg: "Not enough data provided" });
  }
};
