const app = require("../app");
const endpoints = require("../endpoints.json");

exports.getIPA = (req, res) => {
  res.send({ endpoints: endpoints });
};
