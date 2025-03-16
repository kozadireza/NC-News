const {
  getApiTopics,
  postNewTopic,
} = require("../../controllers/topics.controller");

const topicsRouter = require("express").Router();
topicsRouter.route("/").get(getApiTopics).post(postNewTopic);

module.exports = topicsRouter;
