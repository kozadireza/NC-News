const { fetchArticleComments } = require("../models/comments.model");

exports.getArticleComments = (req, res, next) => {
  const id = Number(req.params.article_id);
  fetchArticleComments(id)
    .then((comments_data) => {
      res.send({ comments: comments_data });
    })
    .catch((err) => {
      next(err);
    });
};
