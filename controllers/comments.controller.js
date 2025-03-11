const {
  fetchArticleComments,
  createArticleComment,
} = require("../models/comments.model");

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

exports.postArticleComments = (req, res, next) => {
  const id = Number(req.params.article_id);
  const { author } = req.body;
  const { body } = req.body;
  console.log(author);
  createArticleComment(author, body, id)
    .then((comment_data) => {
      res.status(201).send({ comment: comment_data[0] });
    })
    .catch((err) => {
      next(err);
    });
};
