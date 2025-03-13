const db = require("../db/connection");

exports.fetchUserBy_Username = (username) => {
  return db
    .query(`SELECT username, avatar_url, name FROM users WHERE username = $1`, [
      username,
    ])
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows;
      } else {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
    });
};
