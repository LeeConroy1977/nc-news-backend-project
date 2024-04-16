const express = require("express");
const {
  getArticle,
  getAllArticles,
} = require("../controllers/articles_controller");
const router = express.Router();

router.route("/").get(getAllArticles);
router.route("/:article_id").get(getArticle);

module.exports = router;
