const express = require("express");
const {
  patchComment,
  deleteComment,
} = require("../controllers/comments_controller");

const router = express.Router();

router.route("/:comment_id").patch(patchComment).delete(deleteComment);

module.exports = router;
