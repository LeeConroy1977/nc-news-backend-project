const db = require("../db/connection");

async function fetchTopics() {
  const topics = await db.query(`SELECT * FROM topics`);
  return topics.rows;
}

async function createTopic(slug, description) {
  const topics = await db.query(
    `INSERT INTO topics (slug,description) VALUES ($1,$2) RETURNING *`,
    [slug, description]
  );
  return topics.rows[0];
}

module.exports = { fetchTopics, createTopic };
