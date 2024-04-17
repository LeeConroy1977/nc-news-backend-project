const db = require("../db/connection");

async function fetchAllUsers() {
  const users = await db.query(
    `
  SELECT * FROM users`
  );

  return users.rows;
}

async function fetchUser(username) {
  const users = await db.query(
    `
  SELECT * FROM users WHERE users.username = $1`,
    [username]
  );
  if (users.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "No user exist" });
  }
  return users.rows[0];
}

module.exports = { fetchAllUsers, fetchUser };
