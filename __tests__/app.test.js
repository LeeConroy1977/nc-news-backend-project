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
  });
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

  describe("/api/articles", () => {
    test("GET:200 sends an array of articles to the client with the correct length and datatype", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("number");
          });
        });
    });
    test("GET:200 articles[0] should match given object", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles[0]).toMatchObject({
            author: "icellusedkars",
            title: "Eight pug gifs that remind me of mitch",
            article_id: 3,
            topic: "mitch",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 2,
          });
        });
    });
    test("GET:200 articles array should be sort by article.created_at in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          const { articles } = res.body;
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("GET:200 should return an array of articles to the client filtered by the query topic with the value 'mitch", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(12);
          articles.forEach((article) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("number");
          });
        });
    });
    test("GET:200 should return an array of articles filtered by 'cats'", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(1);
          expect(articles[0]).toMatchObject({
            author: "rogersop",
            title: "UNCOVERED: catspiracy to bring down democracy",
            article_id: 5,
            topic: "cats",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 2,
          });
        });
    });
    test("GET:200 should return an empty array of articles filtered by 'paper'", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.length).toBe(0);
          expect(articles[0]).toBe(undefined);
        });
    });
    test("GET:400 should return a status 400 when filtered by an incorrect value 'incorrect'", () => {
      return request(app)
        .get("/api/articles?topic=incorrect")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid query");
        });
    });
  });

  describe("/api/articles/:articles_id", () => {
    test("GET:200 should return a given article of a matching article_id", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then((res) => {
          const { article } = res.body;
          expect(article).toMatchObject({
            article_id: 5,
            title: "UNCOVERED: catspiracy to bring down democracy",
            topic: "cats",
            author: "rogersop",
            body: "Bastet walks amongst us, and the cats are taking arms!",
            created_at: "2020-08-03T13:14:00.000Z",
            votes: 0,
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
    test("PATCH:200 should return a given article with an incremented votes value", () => {
      const sentObject = {
        inc_vote: 10,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(sentObject)
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 110,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("PATCH:200 should return a given article with an decremented votes value", () => {
      const sentObject = {
        inc_vote: -10,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(sentObject)
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 90,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("PATCH:404 should return a 404 error with the correct err.msg when passed a article that does not exist", () => {
      const sentObject = {
        inc_vote: 9999,
      };
      return request(app)
        .patch("/api/articles/9999")
        .send(sentObject)
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Artical does not exist");
        });
    });
    test("PATCH:400 should return a 400 error with the correct err.msg of 'Bad Request when passed an endpoint of the incorrect data-type ", () => {
      const sentObject = {
        inc_vote: 999,
      };
      return request(app)
        .patch("/api/articles/string")
        .send(sentObject)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Bad Request");
        });
    });
    test("PATCH:400 should return a 400 error with the correct err.msg of 'Bad Request when passed an object with the incorrect properties ", () => {
      const sentObject = {
        vote: 999,
      };
      return request(app)
        .patch("/api/articles/string")
        .send(sentObject)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Bad Request");
        });
    });
    test("PATCH:400 should return a 400 error with the correct err.msg of 'Bad Request when passed an object with the incorrect value type ", () => {
      const sentObject = {
        vote: true,
      };
      return request(app)
        .patch("/api/articles/string")
        .send(sentObject)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Bad Request");
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    test("GET:200 should return an array of comments of a matching article_id with correct array length and datatype", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { articleComments } = body;
          expect(articleComments.length).toBe(11);
          articleComments.forEach((comment) => {
            expect(typeof comment.comment_id).toBe("number");
            expect(typeof comment.votes).toBe("number");
            expect(typeof comment.created_at).toBe("string");
            expect(typeof comment.author).toBe("string");
            expect(typeof comment.body).toBe("string");
            expect(typeof comment.article_id).toBe("number");
          });
        });
    });
    test("GET:200 articleComments[0] should match given object", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { articleComments } = body;
          expect(articleComments[0]).toMatchObject({
            comment_id: 5,
            body: "I hate streaming noses",
            article_id: 1,
            author: "icellusedkars",
            votes: 0,
            created_at: "2020-11-03T21:00:00.000Z",
          });
        });
    });
    test("GET:200 articleComments array should be sorted comments.created_at in descending order", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { articleComments } = body;
          expect(articleComments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("STATUS:404 Should return a custom err.status and err.msg", () => {
      return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Artical does not exist");
        });
    });
    test("STATUS:400 Should return 400 status with the err.msg 'Bad Request'", () => {
      return request(app)
        .get("/api/articles/string/comments")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Bad Request");
        });
    });
    test("POST:201 should return posted object properties and values and the default properties and values of the object", () => {
      const sentObject = {
        username: "icellusedkars",
        body: "This is an article comment!",
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(sentObject)
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toMatchObject({
            comment_id: 19,
            body: "This is an article comment!",
            article_id: 2,
            author: "icellusedkars",
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
    test("POST:404 should return a 400 with the error message 'Bad Request' when posting to an article that doesn't exist ", () => {
      const sentObject = {
        username: "icellusedkars",
        body: "This is an article comment!",
      };
      return request(app)
        .post("/api/articles/100/comments")
        .send(sentObject)
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Article cannot be found");
        });
    });
    test("POST:400 should return 404 when the posted object properties are the incorrect amount ", () => {
      const sentObject = {
        body: "This is an article comment!",
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(sentObject)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Object");
        });
    });
    test("POST:400 should return 404 when the posted object properties are the incorrect", () => {
      const sentObject = {
        user: "icellusedkars",
        body: "This is an article comment!",
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(sentObject)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Object");
        });
    });
    test("POST:404 should return 404 when the posted object values are the incorrect data-type ", () => {
      const sentObject = {
        username: true,
        body: "This is an article comment!",
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(sentObject)
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Article cannot be found");
        });
    });
  });
  describe("/api/comments/comment_id", () => {
    test("DELETE:204 should delete a comment with the given comment_id ", () => {
      return request(app).delete("/api/comments/2").expect(204);
    });
    test("DELETE:404 should return a 404 with the error message 'comment does not exist' when deleting a comment that doesn't exist ", () => {
      return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Comment does not exist");
        });
    });
    test("DELETE:400 should return a 400 with the error message 'Bad Request' when deleting a comment with the wrong data type ", () => {
      return request(app)
        .delete("/api/comments/string")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Bad Request");
        });
    });
  });

  describe("/api/users", () => {
    test("GET:200 should return an array of all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
          });
        });
    });
    test("GET:200 users[0] should match given object", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
          const { users } = res.body;
          expect(users[0]).toMatchObject({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          });
        });
    });
  });
});
