const { catchAsync } = require("../utils/utils");
const {
  fetchArticle,
  fetchAllArticles,
  fetchArticleComments,
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
