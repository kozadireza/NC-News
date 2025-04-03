const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app");
const db = require("../db/connection");
require("jest-sorted");

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
        expect(body.topics.length).not.toBe(0);
        body.topics.forEach((topic) => {
          expect(Object.keys(topic)).toContain("slug");
          expect(Object.keys(topic)).toContain("description");
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});
describe("POST /api/topics", () => {
  test("201: Responds with an object contains posted topic's data.", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "topic name here",
        description: "description here",
      })
      .expect(201)
      .then(({ body: { newTopic } }) => {
        expect(typeof newTopic).toBe("object");
        expect(newTopic.slug).toBe("topic name here");
        expect(newTopic.description).toBe("description here");
        expect(newTopic.img_url).toBe(null);
      });
  });

  test("400: Responds with error 400 and message: 'Not enough data provided!', if not all required data is not provided.", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: 4568,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Not enough data provided!");
      });
  });

  test("400: Responds with error 400 and message: 'Invalid column name', if wrong format of data were provided in a body ", () => {
    return request(app)
      .post("/api/topics")
      .send({
        author: 679,
        body: "Try to do something",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid column name");
      });
  });
});
describe("GET /api/articles", () => {
  test("200: Responds with an array of article's objects, excludes the property:'body' and  includes new property column: 'article_comments', containing  total count of all the comments with this article_id , which should be sorted by date in descending order", () => {
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

describe("GET /api/articles >>> sorting queries", () => {
  test("SORT_BY: 200: Responds with an array of article's objects, excludes the property:'body' and  includes new property column: 'article_comments', containing  total count of all the comments with this article_id , which should be sorted by default", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
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
          key: "article_id",
          descending: true,
        });
      });
  });

  test("SORT_BY: 400: Responds with error 400 and message: 'Invalid column name', if wrong column's name was provided", () => {
    return request(app)
      .get("/api/articles?sort_by=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid column name");
      });
  });
  test("ORDER: 200: Responds with an array of article's objects, excludes the property:'body' and  includes new property column: 'article_comments', containing  total count of all the comments with this article_id , which should be sorted by created_at in requested order", () => {
    return request(app)
      .get("/api/articles?order=asc")
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
          ascending: true,
        });
      });
  });
  test("ORDER: 400: Responds with error 400 and message: 'Invalid query', if wrong value for ordering was provided", () => {
    return request(app)
      .get("/api/articles?order=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query");
      });
  });

  test("SORT_BY & ORDER: 200: Responds with an array of article's objects, excludes the property:'body' and  includes new property column: 'article_comments', containing  total count of all the comments with this article_id , which should be sorted by requested column and order", () => {
    return request(app)
      .get("/api/articles?sort_by=article_comments&order=asc")
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
          key: "article_comments",
          ascending: true,
        });
      });
  });

  test("SORT_BY & ORDER: 400: Responds with error 400 and message: 'Sorting for the column topic unavailable', if wrong query parameter  was provided", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Sorting for the column topic unavailable");
      });
  });
});

describe("GET /api/articles >>>> pagination", () => {
  test("limit=6&p=2: 200: Responds with an array of 10 article's objects, excludes the property:'body' and  includes new property column: 'article_comments', containing  total count of all the comments with this article_id , which should be sorted by default", () => {
    return request(app)
      .get("/api/articles?limit=6&p=2")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        const total_articles = body.total_articles;

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
        expect(typeof total_articles).toBe("number");
        expect(articles).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });

  test("/: 200: Responds with an array of 10 article's objects, excludes the property:'body' and  includes new property column: 'article_comments', containing  total count of all the comments with this article_id , which should be sorted by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        const total_articles = body.total_articles;

        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(10);

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
        expect(typeof total_articles).toBe("number");
        expect(articles).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
  test("/?p=2: 200: Responds with an array of article's objects, excludes the property:'body' and  includes new property column: 'article_comments', containing  total count of all the comments with this article_id , which should be sorted by created_at in requested order", () => {
    return request(app)
      .get("/api/articles?p=2")
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

describe("GET /api/articles >>> topic queries", () => {
  test("TOPIC: 200: Responds with an array of article's objects which have requested topic sorted by default", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);

        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.title).toBe("string");
          expect(article.topic).toBe("mitch");
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

  test("TOPIC: 404: Responds with error 404 and message: 'banana not found', if articles with provided topic was not found ", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("banana not found");
      });
  });

  test("TOPIC= : 200: Responds with an array of article's objects, excludes the property:'body' and  includes new property column: 'article_comments', containing  total count of all the comments with this article_id , which should be sorted by date in descending order if searched topic was not provided", () => {
    return request(app)
      .get("/api/articles?topic=")
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

describe("GET /api/articles/:article_id (comment_count)", () => {
  test("200: Responds with an object containing information about article (including new column 'comment_count', which is the total count of all the comments with this article_id) with requested id", () => {
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
        expect(typeof body.article.comment_count).toBe("number");
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
describe("DELETE /api/articles/:article_id", () => {
  test("204: Responds with status 204 'No Content' after the comment is successfully deleted", () => {
    return request(app).delete("/api/articles/12").expect(204);
  });
  test("404: Responds with error 404 and message: article_id not found, if wrong id was provided", () => {
    return request(app)
      .delete("/api/articles/1870")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found");
      });
  });

  test("400: Responds with error 400 and message: 'Invalid data format — please check your input.', if wrong type of data for id was provided", () => {
    return request(app)
      .delete("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data format — please check your input.");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with status 204 'No Content' after the comment is successfully deleted", () => {
    return request(app).delete("/api/comments/12").expect(204);
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

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Responds with the updated comment", () => {
    return request(app)
      .patch("/api/comments/12")
      .send({ inc_votes: 100 })
      .expect(200)
      .then(({ body: { updated_comment } }) => {
        expect(typeof updated_comment).toBe("object");
        expect(updated_comment.votes).toBe(100);
        expect(typeof updated_comment.comment_id).toBe("number");
        expect(typeof updated_comment.article_id).toBe("number");
        expect(typeof updated_comment.body).toBe("string");
        expect(typeof updated_comment.author).toBe("string");
        expect(typeof updated_comment.created_at).toBe("string");
      });
  });
  test("404: Responds with error 404 and message: comment_id not found, if wrong id was provided", () => {
    return request(app)
      .patch("/api/comments/1870")
      .send({ inc_votes: 100 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment_id not found");
      });
  });

  test("400: Responds with error 400 and message: 'Invalid data format — please check your input.', if wrong type of data for id was provided", () => {
    return request(app)
      .patch("/api/comments/banana")
      .send({ inc_votes: 100 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data format — please check your input.");
      });
  });
  test("400: Responds with error 400 and message: 'Invalid data format — please check your input.', if wrong type of data for id was provided", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({ inc_votes: "blablabla" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid data format — please check your input.");
      });
  });

  test("400: Responds with error 400 and message: 'Invalid data format — please check your input.', if wrong type of data for id was provided", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Not enough data for updating comment");
      });
  });
});

describe("PATCH  /api/articles/:article_id", () => {
  test("200: Responds with an object containing information about updated article with requested id", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 50 })
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.updated_article).toBe("object");

        expect(typeof body.updated_article.topic).toBe("string");
        expect(body.updated_article.article_id).toBe(1);
        expect(typeof body.updated_article.title).toBe("string");
        expect(typeof body.updated_article.author).toBe("string");
        expect(typeof body.updated_article.body).toBe("string");
        expect(typeof body.updated_article.created_at).toBe("string");
        expect(body.updated_article.votes).toBe(150);
        expect(typeof body.updated_article.article_img_url).toBe("string");
      });
  });
  test("404: Responds with error 404 and message: article_id not found, if wrong id was provided", () => {
    return request(app)
      .patch("/api/articles/1870")
      .send({ inc_votes: 50 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found");
      });
  });

  test("400: Responds with error 400 and message: 'Invalid data format — please check your input.', if wrong type of data for id was provided", () => {
    return request(app)
      .patch("/api/articles/banana")
      .send({ inc_votes: 50 })
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

  test("404: Responds with error 404 and message: article_id not found, if wrong id was provided", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Not enough data for updating article");
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

  test("200: Responds with status 200 and an empty array, if requested article does not have comments ", () => {
    return request(app)
      .get("/api/articles/12/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
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
describe("GET /api/articles/:article_id/comments >>>>> (pagination)", () => {
  test("/ 200: Responds with an array of comments for the given article_id which  should be served with the most recent comments first  with limiting the number of responses by defaults to 10.", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(Object.keys(body)[0]).toBe("comments");
        expect(body.comments.length <= 10).toBe(true);
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

  test("?limit=5&p=2: 200: Responds with an array of comments for the given article_id which  should be served with the most recent comments first  with limiting the number of responses by 5 on page 2.", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=2")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length <= 5).toBe(true);
        expect(Object.keys(body)[0]).toBe("comments");
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(1);
        });
        expect(body.comments).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });

  test("p=2: 200: Responds with an array of comments for the given article_id which  should be served with the most recent comments first  with limiting the number of responses by 5 on page 2.", () => {
    return request(app)
      .get("/api/articles/1/comments?p=2")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length <= 10).toBe(true);

        expect(Object.keys(body)[0]).toBe("comments");
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(1);
        });
        expect(body.comments).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });

  test("200: Responds with status 200 and an empty array, if requested article does not have comments ", () => {
    return request(app)
      .get("/api/articles/12/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
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

  test("400: Responds with error 400 and message: 'Not enough data provided', if not all required data were provided in a body ", () => {
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

describe("POST /api/articles", () => {
  test("201: Responds with an object contains posted article's data, when enough data were provided", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "Cool pineapple for mitch",
        topic: "mitch",
        author: "lurker",
        body: "Try to do something",
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(typeof article).toBe("object");

        expect(typeof article.article_id).toBe("number");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.created_at).toBe("string");
        expect(article.author).toBe("lurker");
        expect(article.body).toBe("Try to do something");
        expect(article.topic).toBe("mitch");
        expect(article.title).toBe("Cool pineapple for mitch");
      });
  });

  test("400: Responds with error 404 and message: 'Not enough data provided!', if not enough data was provided", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "lurker",
        body: "Try to do something",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Not enough data provided!");
      });
  });

  test("400: Responds with error 400 and message: 'Invalid column name', if wrong  name of property was used in sended object", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "Cool pineapple for mitch",
        topic: "mitch",
        authorsn: "lurker",
        body: "Try to do something",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid column name");
      });
  });

  test("400: Responds with error 400 and message: 'Resource not found — referenced data does not exist.', if wrong type of data were provided in a body ", () => {
    return request(app)
      .post("/api/articles/")
      .send({
        title: "Cool pineapple for mitch",
        topic: 987,
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
});
describe("GET /api/users", () => {
  test("200: Responds with an array of user's objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).not.toBe(0);
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Responds with an user's data object which should have the following properties:username, avatar_url, name", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body: { user_data } }) => {
        expect(user_data).toHaveProperty("username");
        expect(user_data).toHaveProperty("avatar_url");
        expect(user_data).toHaveProperty("name");
      });
  });

  test("404: Responds with status 404 and  error msg: 'User not found', when requested username not found", () => {
    return request(app)
      .get("/api/users/roger")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
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
