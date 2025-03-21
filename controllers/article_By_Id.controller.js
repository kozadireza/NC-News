const {
  fetchArticleById,
  updateArticleById,
  removeArticleById,
} = require("../models/article_By_Id.model");

exports.getArticleById = (req, res, next) => {
  const id = Number(req.params.article_id);
  fetchArticleById(id)
    .then((data) => {
      res.send({ article: data });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const id = Number(req.params.article_id);
  const updating_info = req.body;

  updateArticleById(updating_info, id)
    .then((data) => {
      res.send({ updated_article: data });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  return removeArticleById(article_id)
    .then((data) => {
      res.status(204).send(data);
    })
    .catch((err) => {
      next(err);
    });
};
