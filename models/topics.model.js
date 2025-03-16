const db = require("../db/connection");

exports.fetchApiTopics = () => {
  return db.query(`SELECT slug, description FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.createNewTopic = (newTopicInfo) => {
  const [columnName1, columnName2] = Object.keys(newTopicInfo);
  const valuesOfNewTopic = Object.values(newTopicInfo);
  if (Object.keys(newTopicInfo).length === 2) {
    return db
      .query(
        `INSERT INTO topics (${columnName1}, ${columnName2}) VALUES ($1, $2) RETURNING *`,
        [...valuesOfNewTopic]
      )
      .then(({ rows }) => {
        console.log(rows);
        return { newTopic: rows[0] };
      });
  } else {
    return Promise.reject({ status: 400, msg: "Not enough data provided!" });
  }
};
