const db = require("../db/connection");
//const { checkValueExists } = require("../db/seeds/utils");

exports.fetchAllArticles = async () => {
  const votes_result0 = await db.query(
    `SELECT comments.article_id, CAST(COUNT(*) AS INT) AS comment_count FROM comments GROUP BY article_id ;`
  );
  const votes_result = votes_result0.rows;
  //console.log(votes_result);
  return db
    .query(
      `SELECT author, article_id, title, topic, created_at, votes, article_img_url  FROM articles ORDER BY created_at DESC `
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        const readyArticlesWithCommentsCount = [];
        rows.forEach((article) => {
          const current_commentCount = votes_result.filter((article_votes) => {
            return article_votes.article_id === article.article_id;
          });

          if (current_commentCount.length > 0) {
            const newObjArticle = { ...article };

            newObjArticle.article_comments =
              current_commentCount[0].comment_count;

            readyArticlesWithCommentsCount.push(newObjArticle);
          } else {
            const newObjArticle = { ...article };
            newObjArticle.article_comments = 0;
            readyArticlesWithCommentsCount.push(newObjArticle);
          }
        });
        // console.log(typeof readyArticlesWithCommentsCount[2].article_comments);
        return readyArticlesWithCommentsCount;
      } else {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};
