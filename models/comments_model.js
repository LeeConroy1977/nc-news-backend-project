const db = require("../db/connection");

async function fetchArticleComments(article_id) {
  const articleComments = await db.query(
    `
  SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC
  `,
    [article_id]
  );
  if (articleComments.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Artical does not exist" });
  }

  return articleComments.rows;
}

async function createComment(body, article_id, username) {
  const comment = await db.query(
    `INSERT INTO comments (body, article_id, author) VALUES ($1,$2,$3) RETURNING *`,
    [body, article_id, username]
  );

  return comment.rows[0];
}

async function removeComment(comment_id) {
  return db.query(`DELETE FROM comments WHERE comments.comment_id = $1`, [
    comment_id,
  ]);
}

async function checkCommentExists(comment_id) {
  const comment = await db.query(
    `SELECT * FROM comments WHERE comment_id = $1`,
    [comment_id]
  );

  if (comment.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Comment does not exist" });
  }

  return comment.rows[0];
}

module.exports = {
  fetchArticleComments,
  createComment,
  removeComment,
  checkCommentExists,
};