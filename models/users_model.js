const db = require("../db/connection");

async function fetchAllUsers() {
  const users = await db.query(
    `
  SELECT * FROM users`
  );
  if (users.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "No users exist" });
  }

  return users.rows;
}

module.exports = { fetchAllUsers };
