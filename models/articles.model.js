const db = require("../db/connection");

exports.fetchAllArticles = async (queries) => {
  const keyOfQueries = Object.keys(queries);
  const valuesOfQueries = Object.values(queries);

  const allowedKeys = ["order", "sort_by", "topic", "limit", "p"];
  const nonSortableColumns = ["author", "article_img_url", "topic", "title"];
  ///SORT CONDITIONS

  const isSortByAndOrderProvided =
    keyOfQueries[0] === "sort_by" && keyOfQueries[1] === "order";
  const justSortByProvided =
    keyOfQueries[0] === "sort_by" && keyOfQueries.length === 1;
  const justOrderProvided =
    keyOfQueries[0] === "order" && keyOfQueries.length === 1;

  const isSortColumnValid = !nonSortableColumns.includes(valuesOfQueries[0]);
  ////LIMIT CONDITIONS
  const isFullPagination =
    keyOfQueries[0] === "limit" && keyOfQueries[1] === "p";
  const isDefaultPagination =
    keyOfQueries.length === 1 && keyOfQueries[0] === "p";
  ///TOTAL ARTICLES
  const { total_articles } = (
    await db.query(
      `SELECT CAST(COUNT (*) AS INT) AS total_articles FROM articles `
    )
  ).rows[0];

  if (keyOfQueries.length > 0 && !(valuesOfQueries[0] == "")) {
    let dollarSign = 1;
    if (
      keyOfQueries.every((element) => {
        return allowedKeys.includes(element);
      })
    ) {
      let inputValues = [];
      let queryStr =
        "SELECT articles.author, articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url,  CAST(COUNT(comments.comment_id) AS INT) AS article_comments FROM  articles LEFT JOIN comments ON articles.article_id = comments.article_id ";

      if (keyOfQueries[0] === "topic") {
        queryStr += `WHERE articles.topic = ${"$"}${dollarSign} `;
        inputValues.push(valuesOfQueries[0]);
        dollarSign++;
      }

      queryStr += `GROUP BY articles.article_id `;

      if (isSortByAndOrderProvided && isSortColumnValid) {
        if (valuesOfQueries[0] === "article_comments") {
          queryStr += `ORDER BY COUNT(comments.comment_id) ${valuesOfQueries[1]} `;
        } else {
          queryStr += `ORDER BY articles.${valuesOfQueries[0]} ${valuesOfQueries[1]} `;
        }
      }
      if (justSortByProvided && isSortColumnValid) {
        if (valuesOfQueries[0] === "article_comments") {
          queryStr += `ORDER BY COUNT(comments.comment_id) DESC`;
        } else {
          queryStr += `ORDER BY articles.${valuesOfQueries[0]} DESC `;
        }
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
      if (isFullPagination) {
        const offset =
          (Number(valuesOfQueries[1]) - 1) * Number(valuesOfQueries[0]);

        queryStr += `LIMIT ${"$"}${dollarSign} OFFSET ${offset} `;
        inputValues.push(Number(valuesOfQueries[0]));
      }
      if (isDefaultPagination) {
        const offset = (Number(valuesOfQueries[0]) - 1) * 10;
        queryStr += `LIMIT 10 OFFSET ${offset} `;
      }

      if (inputValues.length === 0) {
        return db.query(queryStr).then(({ rows }) => {
          return { articles: rows, total_articles };
        });
      } else {
        return db.query(queryStr, inputValues).then(({ rows }) => {
          if (rows.length === 0) {
            return Promise.reject({
              status: 404,
              msg: `${inputValues[0]} not found`,
            });
          } else {
            return { articles: rows, total_articles };
          }
        });
      }
    } else {
      return Promise.reject({ status: 400, msg: "Invalid query parameter" });
    }
  } else {
    return db
      .query(
        `SELECT articles.author, articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INT) AS article_comments FROM  articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at desc LIMIT 10 OFFSET 0`
      )
      .then(({ rows }) => {
        return { articles: rows, total_articles };
      });
  }
};

exports.addArticle = (newArticleInfo) => {
  [title, topic, author, body] = Object.keys(newArticleInfo);
  const valuesOfNewArticleInfo = Object.values(newArticleInfo);

  if (
    Object.keys(newArticleInfo).length >= 4 &&
    valuesOfNewArticleInfo.length >= 4
  ) {
    return db
      .query(
        `INSERT INTO articles (${title}, ${topic}, ${author}, ${body}) VALUES ($1,$2, $3, $4 ) RETURNING *`,
        [...valuesOfNewArticleInfo]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  } else {
    return Promise.reject({ status: 400, msg: "Not enough data provided!" });
  }
};
