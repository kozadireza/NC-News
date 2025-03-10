const { fetchArticleById } = require("../models/article_By_Id.model");

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
