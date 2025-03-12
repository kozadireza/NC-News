const { fetchAllArticles } = require("../models/articles.model");

exports.getAllArticles = (req, res, next) => {
  const { query } = req;

  fetchAllArticles(query)
    .then((articlesData) => {
      res.send({ articles: articlesData });
    })
    .catch((err) => {
      next(err);
    });
};
