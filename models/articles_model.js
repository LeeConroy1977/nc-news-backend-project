const db = require("../db/connection");

async function fetchArticle(article_id) {
  const id = Number(article_id);

  const article = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [id]
  );
  if (article.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Artical does not exist" });
  }

  return article.rows[0];
}

module.exports = { fetchArticle };
