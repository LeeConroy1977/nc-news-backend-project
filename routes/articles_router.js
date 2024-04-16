const express = require("express");
const {
  getArticle,
  getAllArticles,
  getArticleComments,
} = require("../controllers/articles_controller");
const router = express.Router();

router.route("/").get(getAllArticles);
router.route("/:article_id").get(getArticle);
router.route("/:article_id/comments").get(getArticleComments);

module.exports = router;
