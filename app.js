const express = require("express");
const { getIPA } = require("./controllers/api.controller");
const { getApiTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
  patchArticleById,
} = require("./controllers/article_By_Id.controller");
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/error.controller");
const { getAllArticles } = require("./controllers/articles.controller");
const {
  getArticleComments,
  postArticleComments,
} = require("./controllers/comments.controller");
const { deleteCommentById } = require("./controllers/comment_By_Id.controller");
const app = express();

app.use(express.json());

app.get("/api", getIPA);

app.get("/api/topics", getApiTopics);
app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postArticleComments);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all(`*`, (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
