const express = require("express");
const {
  getArticle,
  getAllArticles,
} = require("../controllers/articles_controller");
const {
  getArticleComments,
  postComment,
} = require("../controllers/comments_controller");

const router = express.Router();

router.route("/").get(getAllArticles);
router.route("/:article_id").get(getArticle);
router.route("/:article_id/comments").get(getArticleComments).post(postComment);

module.exports = router;
