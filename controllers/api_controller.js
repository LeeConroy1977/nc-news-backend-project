const { catchAsync } = require("../utils/utils");
const fetchApi = require("../models/api_model");

exports.getApi = catchAsync(async (req, res, next) => {
  const data = await fetchApi();

  return res.status(200).json({
    status: "success",
    data,
  });
});
