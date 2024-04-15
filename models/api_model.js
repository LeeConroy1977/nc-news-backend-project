const endpoints = require("../endpoints.json");

async function fetchApi() {
  return endpoints;
}

module.exports = fetchApi;
