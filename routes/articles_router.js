const express = require("express");
const {
  getArticle,
  getAllArticles,
  patchArticle,
} = require("../controllers/articles_controller");
const {
  getArticleComments,
  postComment,
} = require("../controllers/comments_controller");

const router = express.Router();

router.route("/").get(getAllArticles);
router.route("/:article_id").get(getArticle).patch(patchArticle);
router.route("/:article_id/comments").get(getArticleComments).post(postComment);

module.exports = router;
