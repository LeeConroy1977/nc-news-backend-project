const express = require("express");
const { getTopics } = require("../controllers/topics.controller");

const router = express.Router();

router.route("/").get(getTopics);

module.exports = router;
