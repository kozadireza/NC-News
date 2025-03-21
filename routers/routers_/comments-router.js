const {
  deleteCommentById,
  patchCommentById,
} = require("../../controllers/comment_By_Id.controller");

const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchCommentById);

module.exports = commentsRouter;
