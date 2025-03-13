const { getAllUsers } = require("../../controllers/getAllUsers.controller");
const {
  getUserBy_Name,
} = require("../../controllers/getUserBy_Username.controller");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getAllUsers);

usersRouter.route("/:username").get(getUserBy_Name);

module.exports = usersRouter;
