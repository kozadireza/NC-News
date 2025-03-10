const { fetchArticleById } = require("../models/article_By_Id.model");

exports.getArticleById = (req, res, next) => {
  const id = Number(req.params.article_id);
  console.log(typeof id);
  if (typeof id === "number") {
    fetchArticleById(id)
      .then((data) => {
        res.send({ article: data });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    next(err);
  }
};
