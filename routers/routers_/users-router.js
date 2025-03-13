const { getAllUsers } = require("../../controllers/getAllUsers.controller");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getAllUsers);

module.exports = usersRouter;
