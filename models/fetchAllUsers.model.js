const db = require("../db/connection");
const { checkValueExists } = require("../db/seeds/utils");

exports.fetchAllUsers = () => {
  return db.query(`SELECT * from users `).then(({ rows }) => {
    if (rows.length > 0) {
      return rows;
    } else {
      return Promise.reject({ status: 404, msg: "comments not found" });
    }
  });
};
