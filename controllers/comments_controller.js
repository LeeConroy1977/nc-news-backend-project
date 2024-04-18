const { catchAsync } = require("../utils/utils");
const {
  createComment,
  fetchArticleComments,
  removeComment,
  checkCommentExists,
} = require("../models/comments_model");
const { checkArticleExists } = require("../models/articles_model");

exports.getArticleComments = catchAsync(async (req, res, next) => {
  const { article_id } = await req.params;

  const [articleComments] = await Promise.all([
    fetchArticleComments(article_id),
    checkArticleExists(article_id),
  ]);

  return res.status(200).json({
    status: "success",
    articleComments,
  });
});

exports.postComment = catchAsync(async (req, res, next) => {
  const { article_id } = await req.params;
  const { username, body } = await req.body;

  const [comment] = await Promise.all([
    createComment(body, article_id, username),
    checkArticleExists(article_id),
  ]);
  return res.status(201).json({
    status: "success",
    comment: comment,
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const { comment_id } = await req.params;

  const isDeleted = await Promise.all([
    checkCommentExists(comment_id),
    removeComment(comment_id),
  ]);

  if (isDeleted) {
    return res.status(204).json({
      status: "success",
    });
  }
});
