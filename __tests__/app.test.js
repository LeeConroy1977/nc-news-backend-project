const app = require("../app.js");
require("jest-sorted");
const request = require("supertest");
const endpoints = require("../endpoints.json");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const {
  topicData,
  userData,
  articleData,
  commentData,
} = require("../db/data/test-data/index.js");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("tests for nc_news", () => {
  describe("/api", () => {
    test("GET:200 should return identical data compared to the json file", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          const data = res.body.data;
          expect(data).toEqual(endpoints);
        });
    });
  });

  describe("/api/topics", () => {
    test("STATUS:404 - should respond with a 404 error if the endpoint is invalid", () => {
      return request(app)
        .get("/api/9999")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Endpoint");
        });
    });
    test("GET:200 sends an array of topics to the client with the correct length and datatype", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          const { topics } = res.body;
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(typeof topic.description).toBe("string");
            expect(typeof topic.slug).toBe("string");
          });
        });
    });
    test("GET:200 topics[0] should match given object", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          const { topics } = res.body;
          expect(topics[0]).toMatchObject({
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          });
        });
    });
  });
  describe("/api/articles/:articles_id", () => {
    test("GET:200 should return a given article of a matching article_id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          const { article } = res.body;
          expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("STATUS:404 Should return a custom err.status and err.msg", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Artical does not exist");
        });
    });
    test("STATUS:400 Should return 400 status with the err.msg 'Bad Request'", () => {
      return request(app)
        .get("/api/articles/string")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Bad Request");
        });
    });
  });
});
