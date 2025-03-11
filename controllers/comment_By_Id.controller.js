const { removeCommentById } = require("../models/comment_By_Id.model");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then((data) => {
      res.status(204).send({ msg: "no content" });
    })
    .catch((err) => {
      next(err);
    });
};
