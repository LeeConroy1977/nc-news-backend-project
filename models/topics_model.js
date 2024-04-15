const db = require("../db/connection");

async function fetchTopics() {
  const topics = await db.query(`SELECT * FROM topics`);
  return topics.rows;
}

module.exports = { fetchTopics };
