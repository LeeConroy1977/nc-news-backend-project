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

// Invalid Endpoint

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

  // Api Endpoint

  describe("/api", () => {
    test("GET:200 should return identical data compared to the json file", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const { data } = body;
          expect(data).toEqual(endpoints);
        });
    });
  });

  // Topics Enpoint

  describe("/api/topics", () => {
    // Get Request

    test("GET:200 sends an array of topics to the client with the correct length and datatype", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).toHaveLength(3);
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
        .then(({ body }) => {
          const { topics } = body;
          expect(topics[0]).toMatchObject({
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          });
        });
    });

    // Post Request

    test("POST:201 should return posted object properties and values ", () => {
      const sentObject = {
        slug: "whales",
        description: "Not Sharks!",
      };
      return request(app)
        .post("/api/topics")
        .send(sentObject)
        .expect(201)
        .then(({ body }) => {
          const { topic } = body;
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
          expect(topic).toMatchObject({
            slug: "whales",
            description: "Not Sharks!",
          });
        });
    });

    test("POST:400 should return 400 when the posted object is missing a primary key value ", () => {
      const sentObject = {
        desciption: "Not sharks!",
      };
      return request(app)
        .post("/api/topics")
        .send(sentObject)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Object");
        });
    });

    test("POST:400 should return 400 when the posted object keys are the inccorrect type", () => {
      const sentObject = {
        slug: "whales",
        description: 9999,
      };
      return request(app)
        .post("/api/articles")
        .send(sentObject)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Object");
        });
    });
  });

  // Articles Endpoint

  describe("/api/articles", () => {
    //Get Request

    test("GET:200 sends an array of articles to the client with the correct length and datatype", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { results } = body;
          const { articles } = results;
          expect(articles).toHaveLength(10);
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
        .then(({ body }) => {
          const { results } = body;
          const { articles } = results;
          expect(articles[0]).toMatchObject({
            author: "icellusedkars",
            title: "Eight pug gifs that remind me of mitch",
            article_id: 3,
            topic: "mitch",
            created_at: expect.any(String),
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
        .then(({ body }) => {
          const { results } = body;
          const { articles } = results;
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });

    // Ariticles Queries

    test("GET:200 should return an array of articles to the client filtered by the query topic with the value 'mitch", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { results } = body;
          const { articles } = results;
          expect(articles).toHaveLength(10);
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
          const { results } = body;
          const { articles } = results;
          expect(articles).toHaveLength(1);
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
          const { results } = body;
          const { articles } = results;
          expect(articles).toHaveLength(0);
          expect(articles[0]).toBe(undefined);
        });
    });

    test("GET:200 should return an array of articles filtered by topics, sorted by title and in ascending order", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sorted_by=title&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { results } = body;
          const { articles } = results;
          expect(articles).toHaveLength(10);
          expect(articles[0]).toMatchObject({
            author: "icellusedkars",
            title: "A",
            article_id: 6,
            topic: "mitch",
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 1,
          });
        });
    });

    test("GET:200 should return an array of articles sorted by author in descending order ", () => {
      return request(app)
        .get("/api/articles?sorted_by=author")
        .expect(200)
        .then(({ body }) => {
          const { results } = body;
          const { articles } = results;
          expect(articles).toHaveLength(10);
          expect(articles).toBeSortedBy("author", { descending: true });
        });
    });

    test("GET:200 should return an array of articles sorted by created_at in ascending order ", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .then(({ body }) => {
          const { results } = body;
          const { articles } = results;
          expect(articles).toHaveLength(10);
          expect(articles).toBeSortedBy("created_at", { ascending: true });
        });
    });

    test("GET:400 should return a status 400 when sorted by an incorrect articles column", () => {
      return request(app)
        .get("/api/articles?sorted_by=user")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid query");
        });
    });

    test("GET:400 should return a status 400 when sorted by an incorrect order value", () => {
      return request(app)
        .get("/api/articles?order=sideways")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid query");
        });
    });

    test("GET:200 should return an array of a limited number of articles from a specific starting point filtered by topic with the added column total_count", () => {
      return request(app)
        .get("/api/articles?limit=2&p=1&topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { results } = body;
          const { articles, total_count } = results;
          console.log(articles[0]);
          expect(results).toHaveProperty("articles");
          expect(results).toHaveProperty("total_count");
          expect(articles).toHaveLength(2);
          expect(total_count.total_count).toBe(12);
          expect(articles[0]).toMatchObject({
            author: "icellusedkars",
            title: "Eight pug gifs that remind me of mitch",
            article_id: 3,
            topic: "mitch",
            created_at: expect.any(String),
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 2,
          });
        });
    });

    test("GET:200 should return an array of a limited number of articles from a specific starting point with the added column total_count", () => {
      return request(app)
        .get("/api/articles?limit=4&p=2")
        .expect(200)
        .then(({ body }) => {
          const { results } = body;
          const { articles, total_count } = results;

          expect(results).toHaveProperty("articles");
          expect(results).toHaveProperty("total_count");
          expect(articles).toHaveLength(4);
          expect(total_count.total_count).toBe(13);
          expect(articles[0]).toMatchObject({
            author: "butter_bridge",
            title: "Another article about Mitch",
            article_id: 13,
            topic: "mitch",
            created_at: expect.any(String),
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
          });
        });
    });

    // Post Request

    test("POST:201 should return posted object properties and values and the default properties and values of the object", () => {
      const sentObject = {
        author: "icellusedkars",
        title: "Paper Cats",
        body: "This is an article!",
        topic: "cats",
      };
      return request(app)
        .post("/api/articles")
        .send(sentObject)
        .expect(201)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toMatchObject({
            article_id: 14,
            title: "Paper Cats",
            topic: "cats",
            author: "icellusedkars",
            body: "This is an article!",
            created_at: expect.any(String),
            article_img_url: expect.any(String),
            votes: 0,
            comment_count: 0,
          });
        });
    });

    test("POST:400 should return 400 when the posted object properties are the incorrect amount ", () => {
      const sentObject = {
        body: "This is an article!",
      };
      return request(app)
        .post("/api/articles")
        .send(sentObject)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Object");
        });
    });

    test("POST:400 should return 400 when the posted object properties are the incorrect", () => {
      const sentObject = {
        title: "Paper Cats",
        topic: "cats",
        username: "icellusedkars",
        body: "This is an article!",
      };
      return request(app)
        .post("/api/articles")
        .send(sentObject)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Object");
        });
    });

    test("POST:404 should return 400 when the posted object values to foreign keys do not match parent value ", () => {
      const sentObject = {
        title: "cats are great!",
        topic: "Thunder cats",
        author: "icellusedkars",
        body: "This is an article!",
      };
      return request(app)
        .post("/api/articles")
        .send(sentObject)
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Article cannot be found");
        });
    });
  });

  // Articles Params Endpoint

  describe("/api/articles/:articles_id", () => {
    // Get Request

    test("GET:200 should return a given article of a matching article_id", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
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
          expect(msg).toBe("Article does not exist");
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

    // Patch Request

    test("PATCH:200 should return a given article with an incremented votes value", () => {
      const sentObject = {
        inc_votes: 10,
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
        inc_votes: -10,
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
        inc_votes: 9999,
      };
      return request(app)
        .patch("/api/articles/9999")
        .send(sentObject)
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Article does not exist");
        });
    });

    test("PATCH:400 should return a 400 error with the correct err.msg of 'Bad Request' when passed an endpoint of the incorrect data-type ", () => {
      const sentObject = {
        inc_votes: 999,
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

    test("PATCH:400 should return a 400 error with the correct err.msg of 'Bad Request' when passed an object with the incorrect properties ", () => {
      const sentObject = {
        likes: 999,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(sentObject)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Object");
        });
    });

    test("PATCH:400 should return a 400 error with the correct err.msg of 'Bad Request' when passed an object with the incorrect value type ", () => {
      const sentObject = {
        votes: true,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(sentObject)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Object");
        });
    });

    // Delete Request

    test("DELETE:204 should delete aan article with the given comment_id ", () => {
      return request(app).delete("/api/articles/2").expect(204);
    });
    test("DELETE:404 should return a 404 with the error message 'Article does not exist' when deleting an article that doesn't exist ", () => {
      return request(app)
        .delete("/api/articles/9999")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Article does not exist");
        });
    });

    test("DELETE:400 should return a 400 with the error message 'Bad Request' when deleting a comment with the wrong data type ", () => {
      return request(app)
        .delete("/api/articles/string")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Bad Request");
        });
    });
  });

  // Article Comments Enpoint

  describe("/api/articles/:article_id/comments", () => {
    // Get Request

    test("GET:200 should return an array of comments of a matching article_id with correct array length and datatype", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { articleComments } = body;
          expect(articleComments).toHaveLength(10);
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
          expect(msg).toBe("Article does not exist");
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

    test("GET:200 should return an array of a limited number of comments from a specific starting point ", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=3&p=1")
        .expect(200)
        .then(({ body }) => {
          const { articleComments } = body;
          expect(articleComments).toHaveLength(3);
          expect(articleComments[0]).toMatchObject({
            comment_id: 13,
            body: "Fruit pastilles",
            article_id: 1,
            author: "icellusedkars",
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });

    test("GET:200 should return an array of a limited number of articles from a specific starting point with increased page number", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=2&p=2")
        .expect(200)
        .then(({ body }) => {
          const { articleComments } = body;
          expect(articleComments).toHaveLength(2);
          expect(articleComments[0]).toMatchObject({
            comment_id: 7,
            body: "Lobster pot",
            article_id: 1,
            author: "icellusedkars",
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });

    // Post Request

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

    test("POST:404 should return a 404 with the error message 'Bad Request' when posting to an article that doesn't exist ", () => {
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

  // Comments Params Endpoint

  describe("/api/comments/comment_id", () => {
    // Patch Request

    test("PATCH:200 should return a given comment with an incremented votes value", () => {
      const sentObject = {
        inc_votes: 10,
      };
      return request(app)
        .patch("/api/comments/1")
        .send(sentObject)
        .expect(200)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toMatchObject({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 9,
            author: "butter_bridge",
            votes: 26,
            created_at: "2020-04-06T12:17:00.000Z",
          });
        });
    });

    test("PATCH:200 should return a given comment with an decremented votes value", () => {
      const sentObject = {
        inc_votes: -10,
      };
      return request(app)
        .patch("/api/comments/1")
        .send(sentObject)
        .expect(200)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toMatchObject({
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            article_id: 9,
            author: "butter_bridge",
            votes: 6,
            created_at: "2020-04-06T12:17:00.000Z",
          });
        });
    });

    test("PATCH:404 should return a 404 error with the correct err.msg when passed a comment that does not exist", () => {
      const sentObject = {
        inc_votes: 9999,
      };
      return request(app)
        .patch("/api/comments/9999")
        .send(sentObject)
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Comment does not exist");
        });
    });

    test("PATCH:400 should return a 400 error with the correct err.msg of 'Bad Request' when passed an endpoint of the incorrect data-type ", () => {
      const sentObject = {
        inc_votes: 999,
      };
      return request(app)
        .patch("/api/comments/string")
        .send(sentObject)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Bad Request");
        });
    });

    test("PATCH:400 should return a 400 error with the correct err.msg of 'Bad Request' when passed an object with the incorrect properties ", () => {
      const sentObject = {
        likes: 999,
      };
      return request(app)
        .patch("/api/comments/1")
        .send(sentObject)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Object");
        });
    });

    test("PATCH:400 should return a 400 error with the correct err.msg of 'Bad Request' when passed an object with the incorrect value type ", () => {
      const sentObject = {
        votes: true,
      };
      return request(app)
        .patch("/api/comments/1")
        .send(sentObject)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Invalid Object");
        });
    });

    // Delete Request

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

  // Users Endpoint

  describe("/api/users", () => {
    // Get Request

    test("GET:200 should return an array of all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users).toHaveLength(4);
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
        .then(({ body }) => {
          const { users } = body;
          expect(users[0]).toMatchObject({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          });
        });
    });

    test("GET:200 should return a user", () => {
      return request(app)
        .get("/api/users/lurker")
        .expect(200)
        .then(({ body }) => {
          const { user } = body;
          expect(user).toMatchObject({
            username: "lurker",
            name: "do_nothing",
            avatar_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          });
        });
    });

    test("STATUS:404 Should return a custom err.status and err.msg", () => {
      return request(app)
        .get("/api/users/no-name")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("No user exist");
        });
    });
  });
});
