const { fetchApiTopics, createNewTopic } = require("../models/topics.model");

exports.getApiTopics = (req, res) => {
  return fetchApiTopics().then((topics_data) => {
    res.send({ topics: topics_data });
  });
};

exports.postNewTopic = (req, res, next) => {
  return createNewTopic(req.body)
    .then((newTopic_data) => {
      res.status(201).send(newTopic_data);
    })
    .catch((err) => {
      next(err);
    });
};
