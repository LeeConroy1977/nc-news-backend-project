const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "production";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});
console.log(ENV);

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}
const config = {};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}
console.log(process.env.DATABASE_URL, "DATABASE_URL");
console.log(ENV);

module.exports = new Pool(config);
