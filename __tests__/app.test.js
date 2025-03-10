const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app");
const db = require("../db/connection");
require("jest-sorted");
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});
describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const endpoints = body.endpoints;
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, each of which have the following properties: slug, description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body)[0]).toBe("topics");
        expect(Array.isArray(body.topics)).toBe(true);
        body.topics.forEach((topic) => {
          expect(Object.keys(topic).length).toBe(2);
          expect(Object.keys(topic)).toContain("slug");
          expect(Object.keys(topic)).toContain("description");
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article's objects, excludes the property:'body' and  includes new property column: 'comment_count', containing  total count of all the comments with this article_id , which should be sorted by date in descending order", () => {
    return db
      .query(
        `INSERT INTO articles (title, topic, author, body, votes, article_img_url) VALUES ('orange', 'cats', 'rogersop', 'banana', 34, 'tomato') `
      )
      .then(() => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(Array.isArray(articles)).toBe(true);

            articles.forEach((article) => {
              expect(Object.keys(article).length).toBe(8);

              expect(typeof article.author).toBe("string");
              expect(typeof article.article_id).toBe("number");
              expect(typeof article.title).toBe("string");
              expect(typeof article.topic).toBe("string");
              expect(typeof article.created_at).toBe("string");
              expect(typeof article.votes).toBe("number");
              expect(typeof article.article_img_url).toBe("string");
              expect(typeof article.article_comments).toBe("number");
            });
            expect(articles).toBeSorted({
              key: "created_at",
              descending: true,
            });
          });
      });
  });

  test("404: Responds with error message if no articles found in DB ", () => {
    return db.query("DELETE FROM comments").then(() => {
      return db.query(`DELETE FROM articles;`).then(() => {
        return request(app)
          .get("/api/articles")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
          });
      });
    });
  });
});

describe("GET  /api/articles/:article_id", () => {
  test("200: Responds with an object containing information about article with requested id", () => {
    return request(app)
      .get("/api/articles/12")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(Object.keys(body)[0]).toBe("article");
        expect(typeof body.article).toBe("object");

        expect(Object.keys(body.article).length).toBe(8);

        expect(Object.keys(body.article)).toContain("topic");
        expect(Object.keys(body.article)).toContain("article_id");
        expect(Object.keys(body.article)).toContain("title");
        expect(Object.keys(body.article)).toContain("author");
        expect(Object.keys(body.article)).toContain("body");
        expect(Object.keys(body.article)).toContain("created_at");
        expect(Object.keys(body.article)).toContain("votes");
        expect(Object.keys(body.article)).toContain("article_img_url");

        expect(typeof body.article.topic).toBe("string");
        expect(body.article.article_id).toBe(12);
        expect(typeof body.article.title).toBe("string");
        expect(typeof body.article.author).toBe("string");
        expect(typeof body.article.body).toBe("string");
        expect(typeof body.article.created_at).toBe("string");
        expect(typeof body.article.votes).toBe("number");
        expect(typeof body.article.article_img_url).toBe("string");
      });
  });

  test("404: Responds with error 400 and message: Not Found, if wrong type of id for the path was provided", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("Check the server actions if the unexisting path was requested", () => {
  test("404: Responds with error 404 and message: Not Found, if wrong path was provided", () => {
    return request(app)
      .get("/api/articles/1870")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found");
      });
  });
});
