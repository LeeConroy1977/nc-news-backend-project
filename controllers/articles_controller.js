const { catchAsync } = require("../utils/utils");
const {
  fetchArticle,
  fetchAllArticles,
  updateArticle,
  checkArticleExists,
} = require("../models/articles_model");

exports.getAllArticles = catchAsync(async (req, res, next) => {
  const articles = await fetchAllArticles();

  return res.status(200).json({
    status: "success",
    articles,
  });
});

exports.getArticle = catchAsync(async (req, res, next) => {
  const { article_id } = await req.params;

  const article = await fetchArticle(article_id);

  return res.status(200).json({
    status: "success",
    article,
  });
});

exports.patchArticle = catchAsync(async (req, res, next) => {
  const { article_id } = await req.params;
  const { inc_vote } = await req.body;

  const [article] = await Promise.all([
    updateArticle(article_id, inc_vote),
    checkArticleExists(article_id),
  ]);

  return res.status(200).json({
    status: "success",
    article,
  });
});
