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
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);

        articles.forEach((article) => {
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

describe("GET  /api/articles/:article_id", () => {
  test("200: Responds with an object containing information about article with requested id", () => {
    return request(app)
      .get("/api/articles/12")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body)[0]).toBe("article");
        expect(typeof body.article).toBe("object");

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
  test("404: Responds with error 404 and message: article_id not found, if wrong id was provided", () => {
    return request(app)
      .get("/api/articles/1870")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found");
      });
  });

  test("400: Responds with error 400 and message: 'Invalid data format — please check your input., if wrong type data for id was provided", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data format — please check your input.");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with status 204 'No Content' after the comment is successfully deleted", () => {
    return request(app)
      .delete("/api/comments/12")
      .expect(204)
      .then(async ({ body }) => {
        expect(body).toEqual({});
        //check if the comment 12 was successfully deleted
        const check_result = await db.query(
          `SELECT * FROM comments WHERE comment_id = 12`
        );
        expect(check_result.rows.length).toBe(0);
      });
  });
  test("404: Responds with error 404 and message: comment_id not found, if wrong id was provided", () => {
    return request(app)
      .delete("/api/comments/1870")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment_id not found");
      });
  });

  test("400: Responds with error 400 and message: 'Invalid data format — please check your input.', if wrong type of data for id was provided", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data format — please check your input.");
      });
  });
});

describe("PATCH  /api/articles/:article_id", () => {
  test("200: Responds with an object containing information about updated article with requested id", async () => {
    const old_article_votes0 = await db.query(
      `SELECT votes from articles WHERE article_id = 1`
    );
    const old_article_votes = old_article_votes0.rows[0].votes;

    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 50 })
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body)[0]).toBe("updated_article");
        expect(typeof body.updated_article).toBe("object");

        expect(body.updated_article.votes - old_article_votes).toBe(50);

        expect(typeof body.updated_article.topic).toBe("string");
        expect(body.updated_article.article_id).toBe(1);
        expect(typeof body.updated_article.title).toBe("string");
        expect(typeof body.updated_article.author).toBe("string");
        expect(typeof body.updated_article.body).toBe("string");
        expect(typeof body.updated_article.created_at).toBe("string");
        expect(typeof body.updated_article.votes).toBe("number");
        expect(typeof body.updated_article.article_img_url).toBe("string");
      });
  });
  test("404: Responds with error 404 and message: article_id not found, if wrong id was provided", () => {
    return request(app)
      .patch("/api/articles/1870")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found");
      });
  });

  test("400: Responds with error 400 and message: 'Invalid data format — please check your input.', if wrong type of data for id was provided", () => {
    return request(app)
      .patch("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data format — please check your input.");
      });
  });

  test("400: Responds with error 400 and 'Invalid data format — please check your input.', if wrong type of data for patching was provided", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({ inc_votes: "banana" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data format — please check your input.");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id which  should be served with the most recent comments first.", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(Object.keys(body)[0]).toBe("comments");
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(9);
        });
        expect(body.comments).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });

  test("404: Responds with error 404 and message: article_id not found, if wrong id was provided", () => {
    return request(app)
      .get("/api/articles/1870/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found");
      });
  });

  test("404: Responds with error 404 and message: comments not found, if requested article does not have comments ", () => {
    return request(app)
      .get("/api/articles/12/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comments not found");
      });
  });

  test("400: Responds with error 404 and message: 'Invalid data format — please check your input.', if wrong type of data for id was provided", () => {
    return request(app)
      .get("/api/articles/bb/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data format — please check your input.");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with an object contains posted comment's data for the requested article_id.", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        author: "lurker",
        body: "Try to do something",
      })
      .expect(201)
      .then(({ body }) => {
        expect(typeof body).toBe("object");

        expect(typeof body.comment.comment_id).toBe("number");
        expect(typeof body.comment.votes).toBe("number");
        expect(typeof body.comment.created_at).toBe("string");
        expect(body.comment.author).toBe("lurker");
        expect(body.comment.body).toBe("Try to do something");
        expect(body.comment.article_id).toBe(4);
      });
  });

  test("404: Responds with error 404 and message: 'Resource not found — referenced data does not exist.', if wrong id was provided", () => {
    return request(app)
      .post("/api/articles/1870/comments")
      .send({
        author: "lurker",
        body: "Try to do something",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Resource not found — referenced data does not exist."
        );
      });
  });

  test("400: Responds with error 400 and message: 'Bad Request', if wrong  type of id was provided", () => {
    return request(app)
      .post("/api/articles/banana/comments")
      .send({
        author: 679,
        body: "Try to do something",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data format — please check your input.");
      });
  });

  test("400: Responds with error 400 and message: 'Resource not found — referenced data does not exist.', if wrong type of data were provided in a body ", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        author: 679,
        body: "Try to do something",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Resource not found — referenced data does not exist."
        );
      });
  });

  test("400: Responds with error 400 and message: 'Bad Request', if not all required data were provided in a body ", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        author: 679,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Not enough data provided");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of user's objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("Check the server actions if the unexisting path was requested", () => {
  test("404: Responds with error 400 and message: Not Found, if wrong type of id for the path was provided", () => {
    return request(app)
      .get("/api/bananas/banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Page not found");
      });
  });
});
