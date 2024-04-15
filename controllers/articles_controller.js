const { catchAsync } = require("../utils/utils");
const { fetchArticle } = require("../models/articles_model");

exports.getArticle = catchAsync(async (req, res, next) => {
  const { article_id } = await req.params;

  const article = await fetchArticle(article_id);

  return res.status(200).json({
    status: "success",
    article,
  });
});
