const express = require("express");
const {
  getArticle,
  getAllArticles,
} = require("../controllers/articles_controller");
const {
  getArticleComments,
  postComment,
} = require("../controllers/comments_controller");
const postValidator = require("../middleware/post_validation");
const router = express.Router();

router.route("/").get(getAllArticles);
router.route("/:article_id").get(getArticle);
router
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postValidator, postComment);

module.exports = router;
