const db = require("../db/connection");

async function fetchAllArticles(
  topic,
  sorted_by = "created_at",
  order = "desc",
  limit = 10,
  p = 1
) {
  if (topic) {
    if (
      ![
        "mitch",
        "cats",
        "paper",
        "football",
        "programming",
        "cooking",
        "architecture",
        "art",
        "performing arts",
        "advertising",
        "entrepreneurship",
        "marketing",
        "careers",
        "studying",
        "accessories",
        "beauty",
        "fashion",
        "recipes",
        "vegan",
        "action games",
        "adventure games",
        "sports games",
        "classics",
        "dystopian fiction",
        "fantasy",
        "non-fiction",
        "science fiction",
        "action",
        "comedy",
        "drama",
        "horror",
        "romance",
        "sci-fi",
        "thriller",
        "classical",
        "dance",
        "jazz",
        "metal",
        "pop",
        "rock",
        "hiking",
        "fishing",
        "nature",
        "africa",
        "asia",
        "oceania",
        "europe",
        "north america",
        "south america",
        "baseball",
        "cricket",
        "golf",
        "motor sports",
        "rugby",
        "A.I.",
        "electronics",
        "travel",
        "holiday",
        "aviation",
        "boats",
        "cars",
        "motorcycles",
      ].includes(topic)
    ) {
      return Promise.reject({ status: 400, msg: "Invalid query" });
    }
  }
  if (
    ![
      "article_id",
      "title",
      "topic",
      "author",
      "body",
      "created_at",
      "votes",
      "comment_count",
    ].includes(sorted_by)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }

  let offset = p === 1 ? 0 : limit * (p - 1);
  let queryArray = [];
  let queryArrayTwo = [];

  let queryStr = `

  SELECT articles.author,featured,articles.body,title,articles.article_id,articles.topic,articles.created_at,articles.votes,article_img_url, COUNT(comments)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic) {
    queryArray.push(topic);
    queryStr += `WHERE articles.topic = $1`;
  }
  queryStr += `GROUP BY articles.article_id ORDER BY ${sorted_by} ${order} LIMIT ${limit} OFFSET ${offset} `;

  const articlesResponse = await db.query(queryStr, queryArray);

  let queryStrTwo = `SELECT count(articles.article_id)::INT AS total_count FROM articles `;
  if (topic) {
    queryArrayTwo.push(topic);
    queryStrTwo += `WHERE articles.topic = $1`;
  }
  const countResponse = await db.query(queryStrTwo, queryArrayTwo);
  articles = articlesResponse.rows;
  total_count = countResponse.rows[0];
  return { articles, total_count };
}
async function fetchArticle(article_id) {
  console.log(article_id, "<<<<<<<<<<<<<<<<<<<<<");
  const article = await db.query(
    `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count 
     FROM articles 
     LEFT JOIN comments ON comments.article_id = articles.article_id 
     WHERE articles.article_id = $1 
     GROUP BY articles.article_id`,
    [article_id]
  );
  if (article.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article does not exist" });
  }

  console.log("Fetched article:", article.rows[0]);

  return article.rows[0];
}

async function createArticle(author, title, body, topic, article_img_url) {
  const valuesArray = [title, author, topic, body];
  const values = article_img_url ? `($1,$2,$3,$4,$5)` : `($1,$2,$3,$4)`;
  const columnsStr = `title, author, topic, body ${
    article_img_url ? ", article_img_url" : ""
  }`;
  if (article_img_url) valuesArray.push(article_img_url);

  const article = await db.query(
    `INSERT INTO articles (${columnsStr}) VALUES ${values} RETURNING *`,
    valuesArray
  );

  console.log("Created article with ID:", article.rows[0].article_id);
  return article.rows[0];
}

async function updateArticle(article_id, inc_votes = 0) {
  const query = `
    UPDATE articles 
    SET votes = votes + $2
    WHERE article_id = $1 
    RETURNING *`;

  const article = await db.query(query, [article_id, inc_votes]);

  return article.rows[0];
}

async function removeArticle(article_id) {
  const article = await db.query(
    `DELETE FROM articles WHERE articles.article_id = $1 RETURNING *`,
    [article_id]
  );

  return article.rows[0];
}

async function checkArticleExists(article_id) {
  const article = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );
  if (article.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article does not exist" });
  }

  return article.rows[0];
}

module.exports = {
  fetchArticle,
  fetchAllArticles,
  createArticle,
  updateArticle,
  removeArticle,
  checkArticleExists,
};
