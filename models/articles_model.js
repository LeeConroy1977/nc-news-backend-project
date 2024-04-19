const db = require("../db/connection");

async function fetchAllArticles(
  topic,
  sorted_by = "created_at",
  order = "desc",
  limit = 10,
  p = 1
) {
  if (topic) {
    if (!["mitch", "cats", "paper"].includes(topic)) {
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
    ].includes(sorted_by)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }

  const offset = (p = 1 ? limit * (p - 1) : limit * p);
  let queryArray = [];
  let queryArrayTwo = [];

  let queryStr = `

  SELECT articles.author,title,articles.article_id,articles.topic,articles.created_at,articles.votes,article_img_url, COUNT(comments)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic) {
    queryArray.push(topic);
    queryStr += `WHERE articles.topic = $1`;
  }
  queryStr += `GROUP BY articles.article_id ORDER BY ${sorted_by} ${order} LIMIT ${limit} OFFSET ${offset} `;

  const articlesResponse = await db.query(queryStr, queryArray);

  let queryStrTwo = `SELECT  count(articles.article_id)::INT AS total_count FROM articles `;
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
  const article = await db.query(
    `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
    [article_id]
  );
  if (article.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Artical does not exist" });
  }

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
    `INSERT INTO articles (${columnsStr}) VALUES ${values} RETURNING articles.*, (SELECT COUNT(article_id) FROM comments WHERE comments.article_id = articles.article_id)::INT AS comment_count `,
    valuesArray
  );
  return article.rows[0];
}

async function updateArticle(article_id, inc_votes) {
  const article = await db.query(
    `UPDATE articles SET votes = votes + ${inc_votes} WHERE article_id = $1 RETURNING *`,
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
    return Promise.reject({ status: 404, msg: "Artical does not exist" });
  }

  return article.rows[0];
}

module.exports = {
  fetchArticle,
  fetchAllArticles,
  createArticle,
  updateArticle,
  checkArticleExists,
};
