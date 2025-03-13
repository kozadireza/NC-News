const {
  removeCommentById,
  updateCommentById,
} = require("../models/comment_By_Id.model");

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

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const updating_info = req.body;
  updateCommentById(comment_id, updating_info)
    .then((updated_comment) => {
      res.status(200).send({ updated_comment });
    })
    .catch((err) => {
      next(err);
    });
};
