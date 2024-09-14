const { catchAsync } = require("../utils/utils");
const {
  fetchArticle,
  fetchAllArticles,
  createArticle,
  updateArticle,
  removeArticle,
  checkArticleExists,
} = require("../models/articles_model");

exports.getAllArticles = catchAsync(async (req, res) => {
  const { topic, sorted_by, order, limit, p } = await req.query;

  const articlesResponse = await fetchAllArticles(
    topic,
    sorted_by,
    order,
    limit,
    p
  );

  const { articles, total_count } = articlesResponse;

  return res.status(200).send({
    status: "success",
    results: { articles, total_count },
  });
});

exports.getArticle = catchAsync(async (req, res) => {
  const { article_id } = await req.params;

  const article = await fetchArticle(article_id);
  return res.status(200).send({
    article,
  });
});

exports.postArticle = catchAsync(async (req, res) => {
  const { author, title, body, topic, article_img_url } = await req.body;

  const article = await createArticle(
    author,
    title,
    body,
    topic,
    article_img_url
  );

  return res.status(201).send({
    article,
  });
});

exports.patchArticle = catchAsync(async (req, res) => {
  const { article_id } = await req.params;
  const { inc_votes } = await req.body;

  const [article] = await Promise.all([
    updateArticle(article_id, inc_votes),
    checkArticleExists(article_id),
  ]);

  return res.status(200).send({
    article,
  });
});

exports.deleteArticle = catchAsync(async (req, res) => {
  const { article_id } = await req.params;

  const [isDeleted] = await Promise.all([
    removeArticle(article_id),
    checkArticleExists(article_id),
  ]);

  return res.status(204).send();
});
