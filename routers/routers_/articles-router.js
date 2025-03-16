const {
  getArticleById,
  patchArticleById,
} = require("../../controllers/article_By_Id.controller");
const {
  getAllArticles,
  postArticle,
} = require("../../controllers/articles.controller");
const {
  getArticleComments,
  postArticleComments,
} = require("../../controllers/comments.controller");
const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getAllArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postArticleComments);

module.exports = articlesRouter;
