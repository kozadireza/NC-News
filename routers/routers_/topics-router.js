const { getApiTopics } = require("../../controllers/topics.controller");

const topicsRouter = require("express").Router();
topicsRouter.route("/").get(getApiTopics);

module.exports = topicsRouter;
