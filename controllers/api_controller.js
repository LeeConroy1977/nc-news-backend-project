const { catchAsync } = require("../utils/utils");
const endpoints = require("../endpoints.json");

exports.getApi = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: "success",
    data: endpoints,
  });
});
