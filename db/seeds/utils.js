const db = require("../../db/connection");
const format = require("pg-format");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (key, value, data) => {
  return data.reduce((refObj, row) => {
    refObj[row[key]] = row[value];
    return refObj;
  }, {});
};

exports.formatData = (refObj, keyToRemove, keyToAdd, rawData) => {
  return rawData.map(({ [keyToRemove]: removedKey, ...row }) => {
    return { ...row, [keyToAdd]: refObj[removedKey] };
  });
};

exports.checkValueExists = async (table, column, value) => {
  // console.log(">>>>>");
  // console.log(column);
  // console.log(table);
  // console.log(value);
  const querystr = format(`SELECT * FROM %I WHERE %I = $1;`, table, column);
  const dbOutput = await db.query(querystr, [value]);
  // console.log(dbOutput);
  if (dbOutput.rows.length === 0) {
    // resource does NOT exist
    return Promise.reject({
      status: 404,
      msg: `${column} not found`,
    });
  }
};
