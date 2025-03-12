const db = require("../db/connection");

exports.fetchAllUsers = () => {
  return db.query(`SELECT * from users `).then(({ rows }) => {
    return rows;
  });
};
