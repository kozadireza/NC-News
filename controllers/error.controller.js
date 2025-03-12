exports.handlePsqlErrors = (err, req, res, next) => {
  // console.log(err);
  if (err.code === "22P02") {
    res
      .status(400)
      .send({ msg: "Invalid data format — please check your input." });
  }
  if (err.code === "42703") {
    res.status(400).send({
      msg: "Invalid column name — please verify your request parameters.",
    });
  }
  if (err.code === "23503") {
    res
      .status(400)
      .send({ msg: "Resource not found — referenced data does not exist." });
  }
  if (err.code === "42601") {
    res
      .status(400)
      .send({ msg: "Syntax Error: Please check your SQL query syntax." });
  }
  next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Unable to reach server" });
  next(err);
};
