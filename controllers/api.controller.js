const endpoints = require("../endpoints.json");

exports.getIPA = (req, res) => {
  res.send({ endpoints: endpoints });
};
