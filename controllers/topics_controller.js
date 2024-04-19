const { catchAsync } = require("../utils/utils");
const { fetchTopics, createTopic } = require("../models/topics_model");

exports.getTopics = catchAsync(async (req, res, next) => {
  const topics = await fetchTopics();

  return res.status(200).send({
    topics,
  });
});

exports.postTopic = catchAsync(async (req, res, next) => {
  const { slug, description } = await req.body;
  const topic = await createTopic(slug, description);

  return res.status(201).send({
    topic,
  });
});
