const db = require("../db/connection");
const { checkSpeciesExists } = require("../db/seeds/utils");

exports.fetchArticleById = async (id) => {
  const checkTreasureIsExisting = await checkSpeciesExists(
    "articles",
    "article_id",
    id
  );
  if (!checkTreasureIsExisting) {
    // console.log(checkTreasureIsExisting);
    return db
      .query(`SELECT * from articles WHERE article_id = $1`, [id])
      .then(({ rows }) => {
        //console.log(rows);
        return rows[0];
      });
  } else {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }
};
