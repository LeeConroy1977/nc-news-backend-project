const { catchAsync } = require("../utils/utils");
const { fetchAllUsers, fetchUser } = require("../models/users_model");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await fetchAllUsers();

  return res.status(200).send({
    users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { username } = await req.params;
  const user = await fetchUser(username);

  return res.status(200).send({
    user,
  });
});
