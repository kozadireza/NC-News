const {
  convertTimestampToDate,
  checkValueExists,
  formatData,
  createRef,
} = require("../db/seeds/utils");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

beforeAll(() => seed(data));
afterAll(() => db.end());
describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createRef", () => {
  test("returns object", () => {
    expect(typeof createRef("", "", [])).toBe("object");
  });
  test("assigns property of passed key and value attribute", () => {
    const ref = createRef("name", "id", [{ name: "david", id: 1 }]);
    expect(Object.keys(ref)).toHaveLength(1);
    expect(ref).toHaveProperty("david");
    expect(ref.david).toBe(1);
  });
  test("assigns the number of properties as there are objects in array", () => {
    const ref = createRef("name", "id", [
      { name: "david", id: 1 },
      { name: "jim", id: 2 },
      { name: "liam", id: 3 },
    ]);

    expect(Object.keys(ref)).toHaveLength(3);

    expect(ref.david).toBe(1);
    expect(ref.jim).toBe(2);
    expect(ref.liam).toBe(3);
  });
  test("doesn't mutate original input", () => {
    const input = [{ name: "david", id: 1 }];
    createRef("name", "id", input);

    expect(input).toEqual([{ name: "david", id: 1 }]);
  });
});

describe("formatData", () => {
  test("returns an array", () => {
    expect(Array.isArray(formatData({}, "", "", []))).toBe(true);
  });
  test("removes keyToRemove property", () => {
    const keyToRemove = "name";
    const formattedData = formatData({ david: 1 }, keyToRemove, "id", [
      { name: "david" },
    ]);

    expect(formattedData[0]).not.toHaveProperty("name");
  });
  test("adds keyToAdd property", () => {
    const keyToAdd = "id";
    const formattedData = formatData({ david: 1 }, "name", keyToAdd, [
      { name: "david" },
    ]);

    expect(formattedData[0]).toHaveProperty("id");
  });
  test("keyToAdd property has value from refObj", () => {
    const keyToAdd = "id";
    const formattedData = formatData({ david: 1 }, "name", keyToAdd, [
      { name: "david" },
    ]);

    expect(formattedData[0].id).toBe(1);
  });
  test("does not mutate raw data", () => {
    const rawData = [{ name: "david" }];
    formatData({ david: 1 }, "name", "id", rawData);

    expect(rawData).toEqual([{ name: "david" }]);
  });
});

describe.skip("checkSpeciesExists", () => {
  test("returns error 404 and msg 'article_id not found' if the name of the item is not in the requested table and column ", async () => {
    const table = "comments";
    const column_name = "article_id";
    const searchedValue = 29;
    try {
      await checkValueExists(table, column_name, searchedValue);
    } catch (err) {
      expect(err).toEqual({ status: 404, msg: "article_id not found" });
    }
  });
  test("returns 'undefined if searched value was found in the requested table and column", async () => {
    const table = "comments";
    const column_name = "article_id";
    const searchedValue = 1;
    const checkResult = await checkValueExists(
      table,
      column_name,
      searchedValue
    );

    expect(checkResult).toBe(undefined);
  });
});
