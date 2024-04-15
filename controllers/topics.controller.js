const { catchAsync } = require("../utils/utils");
const { fetchTopics } = require("../models/topics.model");

exports.getTopics = catchAsync(async (req, res, next) => {
  const topics = await fetchTopics();

  return res.status(200).json({
    status: "success",
    topics,
  });
});
