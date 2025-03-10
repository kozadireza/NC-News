const express = require("express");
const { getIPA } = require("./controllers/api.controller");
const app = express();
module.exports = app;

app.get("/api", getIPA);

app.all(`*`, (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});
