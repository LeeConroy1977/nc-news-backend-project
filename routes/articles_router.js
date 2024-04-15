const express = require("express");
const { getArticle } = require("../controllers/articles_controller");
const router = express.Router();

router.route("/:article_id").get(getArticle);

module.exports = router;
