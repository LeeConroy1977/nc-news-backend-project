const db = require("../db/connection");

async function fetchAllArticles(
  topic,
  sorted_by = "created_at",
  order = "desc",
  limit = 10,
  p = 1
) {
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
    return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
  }

  if (!["asc", "desc"].includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let normalizedTopic = topic ? topic.toLowerCase() : null;
  if (normalizedTopic) {
    const topicExists = await db.query(
      `SELECT slug FROM topics WHERE LOWER(slug) = $1`,
      [normalizedTopic]
    );
    if (topicExists.rows.length === 0) {
      return Promise.reject({ status: 400, msg: `Invalid topic: ${topic}` });
    }
  }

  const parsedLimit = parseInt(limit, 10) || 10;
  const parsedPage = parseInt(p, 10) || 1;
  if (parsedLimit < 1 || parsedPage < 1) {
    return Promise.reject({ status: 400, msg: "Invalid limit or page query" });
  }

  let offset = parsedPage === 1 ? 0 : parsedLimit * (parsedPage - 1);
  let queryArray = [];
  let queryStr = `
    SELECT articles.author, articles.featured, articles.body, articles.title, 
           articles.article_id, articles.topic, articles.created_at, articles.votes, 
           articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (normalizedTopic) {
    queryArray.push(normalizedTopic);
    queryStr += `WHERE LOWER(articles.topic) = $1 `;
  }

  const safeSortedBy = sorted_by.replace(/[^a-zA-Z_]/g, "");
  queryStr += `GROUP BY articles.article_id ORDER BY ${safeSortedBy} ${order.toUpperCase()} LIMIT ${parsedLimit} OFFSET ${offset}`;

  try {
    const articlesResponse = await db.query(queryStr, queryArray);

    let queryStrTwo = `SELECT COUNT(articles.article_id)::INT AS total_count FROM articles `;
    let queryArrayTwo = [];
    if (normalizedTopic) {
      queryArrayTwo.push(normalizedTopic);
      queryStrTwo += `WHERE LOWER(articles.topic) = $1`;
    }

    const countResponse = await db.query(queryStrTwo, queryArrayTwo);

    const articles = articlesResponse.rows;
    const total_count = countResponse.rows[0] || { total_count: 0 };

    return { articles, total_count };
  } catch (error) {
    console.error("Database query error:", error.message, error.stack);
    throw { status: 500, msg: "Internal Server Error" };
  }
}
async function fetchArticle(article_id) {
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

  return article.rows[0];
}

async function updateArticle(article_id, inc_votes, featured) {
  const setClauses = [];
  const values = [article_id];

  if (inc_votes !== undefined) {
    setClauses.push(`votes = votes + $${values.length + 1}`);
    values.push(inc_votes);
  }

  if (featured !== undefined) {
    setClauses.push(`featured = $${values.length + 1}`);
    values.push(featured);
  }

  if (setClauses.length === 0) {
    throw new Error("No valid fields to update");
  }

  const query = `
    UPDATE articles 
    SET ${setClauses.join(", ")}
    WHERE article_id = $1 
    RETURNING *`;

  const article = await db.query(query, values);

  if (article.rows.length === 0) {
    throw new Error("Article not found");
  }

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
