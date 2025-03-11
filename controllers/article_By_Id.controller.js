const {
  fetchArticleById,
  updateArticleById,
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
  const [key] = Object.keys(req.body);
  const inc_votes = req.body[key];

  updateArticleById(inc_votes, id)
    .then((data) => {
      res.send({ updated_article: data });
    })
    .catch((err) => {
      next(err);
    });
};
