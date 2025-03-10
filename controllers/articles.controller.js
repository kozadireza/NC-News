const { fetchAllArticles } = require("../models/articles.model");

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articlesData) => {
      res.send({ articles: articlesData });
    })
    .catch((err) => {
      next(err);
    });
};
