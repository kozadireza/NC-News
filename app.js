const express = require("express");
const app = express();
const apiRouter = require("./routers/apiRouter");

const { getIPA } = require("./controllers/api.controller");
const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./controllers/error.controller");

app.use(express.json());

app.use("/api", apiRouter);

app.get("/api", getIPA);

app.all(`*`, (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
