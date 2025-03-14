const { fetchAllArticles, addArticle } = require("../models/articles.model");

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

exports.postArticle = (req, res, next) => {
  const newArticleInfo = req.body;
  addArticle(newArticleInfo)
    .then((newArticle) => {
      res.status(201).send({ article: newArticle });
    })
    .catch((err) => {
      next(err);
    });
};
