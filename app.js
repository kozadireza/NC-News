const express = require("express");
const { getIPA } = require("./controllers/api.controller");
const { GetApiTopics } = require("./controllers/topics.controller");
const app = express();
module.exports = app;

app.get("/api", getIPA);

app.get("/api/topics", GetApiTopics);

app.all(`*`, (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});
