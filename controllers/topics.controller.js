const { fetchApiTopics } = require("../models/topics.model");

exports.getApiTopics = (req, res) => {
  return fetchApiTopics().then((topics_data) => {
    res.send({ topics: topics_data });
  });
};
