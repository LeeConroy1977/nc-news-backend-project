const { catchAsync } = require("../utils/utils");
const { fetchAllUsers } = require("../models/users_model");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await fetchAllUsers();

  return res.status(200).json({
    status: "success",
    users,
  });
});
