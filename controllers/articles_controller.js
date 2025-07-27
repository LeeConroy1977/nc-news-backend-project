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
  const { article_id } = req.params;
  const { inc_votes, featured } = req.body;

  const validKeys = ["inc_votes", "featured"];
  const receivedKeys = Object.keys(req.body);
  const hasInvalidKeys = receivedKeys.some((key) => !validKeys.includes(key));
  const hasValidKeys =
    receivedKeys.length > 0 &&
    receivedKeys.every((key) => validKeys.includes(key));

  if (hasInvalidKeys || !hasValidKeys) {
    return res.status(400).send({ msg: "Invalid Object" });
  }

  if (inc_votes !== undefined && typeof inc_votes !== "number") {
    return res.status(400).send({ msg: "Invalid Object" });
  }

  if (featured !== undefined && typeof featured !== "boolean") {
    return res.status(400).send({ msg: "Invalid Object" });
  }

  await checkArticleExists(article_id);

  const article = await updateArticle(article_id, inc_votes, featured);

  return res.status(200).send({
    article,
  });
});

exports.deleteArticle = catchAsync(async (req, res) => {
  const { article_id } = req.params;

  const articleIdNum = parseInt(article_id, 10);
  if (isNaN(articleIdNum)) {
    throw { status: 400, msg: "Bad Request" };
  }

  await checkArticleExists(articleIdNum);


  await removeArticle(articleIdNum);

  return res.status(204).send();
});
