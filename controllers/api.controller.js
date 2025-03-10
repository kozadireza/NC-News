const app = require("../app");
const endpoints = require("../endpoints.json");

exports.getIPA = (req, res) => {
  console.log(endpoints);
  res.send({ endpoints: endpoints });
};
