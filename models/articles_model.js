const db = require("../db/connection");

async function fetchAllArticles() {
  const articles = await db.query(
    `SELECT articles.author,title,articles.article_id,articles.topic,articles.created_at,articles.votes,article_img_url, COUNT(comments)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`
  );
  return articles.rows;
}

async function fetchArticle(article_id) {
  const article = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );
  if (article.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Artical does not exist" });
  }

  return article.rows[0];
}

async function updateArticle(article_id, inc_vote) {
  const { votes } = await fetchArticle(article_id);
  const incVotes = votes + inc_vote;
  const article = await db.query(
    `UPDATE articles SET votes = ${incVotes} WHERE article_id = $1 RETURNING *`,
    [article_id]
  );
  console.log(article.rows);
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
  checkArticleExists,
  updateArticle,
};
