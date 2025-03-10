const db = require("../db/connection");
const checkSpeciesExists = require("../db/seeds/utils");

exports.fetchApiTopics = () => {
  return db.query(`SELECT slug, description FROM topics`).then(({ rows }) => {
    return rows;
  });
};
