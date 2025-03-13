const {
  fetchUserBy_Username,
} = require("../models/fetchUserBy_Username.model");

exports.getUserBy_Name = (req, res, next) => {
  const { username } = req.params;

  fetchUserBy_Username(username)
    .then((user_data) => {
      res.send({ user_data: user_data[0] });
    })
    .catch((err) => {
      next(err);
    });
};
