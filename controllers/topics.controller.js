const { fetchApiTopics } = require("../models/topics.model");

exports.getApiTopics = (req, res) => {
  return fetchApiTopics().then((data) => {
    res.send({ topics: data });
  });
};
