const { fetchAllUsers } = require("../models/fetchAllUsers.model");

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers().then((users_data) => {
    res.send({ users: users_data });
  });
};
