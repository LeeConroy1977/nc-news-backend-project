const { catchAsync } = require("../utils/utils");
const {
  fetchArticle,
  fetchAllArticles,
  createArticle,
  updateArticle,
  checkArticleExists,
} = require("../models/articles_model");

exports.getAllArticles = catchAsync(async (req, res, next) => {
  const { topic, sorted_by, order } = await req.query;

  const articles = await fetchAllArticles(topic, sorted_by, order);
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

exports.postArticle = catchAsync(async (req, res, next) => {
  const { author, title, body, topic } = await req.body;

  const article = await createArticle(author, title, body, topic);

  return res.status(201).json({
    status: "success",
    article,
  });
});

exports.patchArticle = catchAsync(async (req, res, next) => {
  const { article_id } = await req.params;
  const { inc_votes } = await req.body;

  const [article] = await Promise.all([
    updateArticle(article_id, inc_votes),
    checkArticleExists(article_id),
  ]);

  return res.status(200).json({
    status: "success",
    article,
  });
});
