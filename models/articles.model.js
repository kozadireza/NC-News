const db = require("../db/connection");

exports.fetchAllArticles = async (queries) => {
  const allowedKeys = ["order", "sort_by", "topic", "limit", "p"];
  const nonSortableColumns = ["author", "article_img_url", "topic", "title"];
  const isSortColumnValid = !nonSortableColumns.includes(queries.sort_by);

  ///TOTAL ARTICLES
  // todo: roll this into the main query
  const { total_articles } = (
    await db.query(
      `SELECT CAST(COUNT (*) AS INT) AS total_articles FROM articles `
    )
  ).rows[0];

  const allKeysValid = Object.keys(queries).every((element) =>
    allowedKeys.includes(element)
  );
  if (!allKeysValid) {
    return Promise.reject({ status: 400, msg: "Invalid query parameter" });
  }

  let dollarSign = 1;
  let inputValues = [];

  let queryStr = `SELECT articles.author, articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url,  
      CAST(COUNT(comments.comment_id) AS INT) AS article_comments 
      FROM  articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id\n`;

  if (queries.topic && queries.topic !== "null") {
    queryStr += `WHERE articles.topic = ${"$"}${dollarSign++}\n`;
    inputValues.push(queries.topic);
  }

  queryStr += `GROUP BY articles.article_id\n`;

  if (queries.sort_by && !isSortColumnValid) {
    return Promise.reject({
      status: 400,
      msg: `Sorting for the column ${queries.sort_by} unavailable`,
    });
  }

  let column = null;
  switch (queries.sort_by) {
    case "article_comments":
      column = "COUNT(comments.comment_id)";
      break;
    case undefined:
      column = "articles.created_at";
      break;
    case "null":
      column = "articles.created_at";
      break;

    default:
      column = `articles.${queries.sort_by}`; // we've mitigated injection attacks because we know that isSortColumnValid
  }
  // todo: order is subject to injection attack here. Check its value is either ASC or DESC
  queryStr += `ORDER BY ${column} ${
    queries.order && queries.order !== "null" ? queries.order : "DESC"
  }\n`;

  let limit = Number(queries.limit) || 10;
  let offset = ((Number(queries.p) || 1) - 1) * limit;
  queryStr += `LIMIT $${dollarSign++} OFFSET $${dollarSign++}\n`;
  inputValues.push(limit);
  inputValues.push(Number(offset));

  return db.query(queryStr, inputValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `no articles found`,
      });
    } else {
      return { articles: rows, total_articles };
    }
  });
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
