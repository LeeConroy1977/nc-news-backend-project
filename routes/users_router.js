const express = require("express");
const { getAllUsers, getUser } = require("../controllers/users_controller");

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/:username").get(getUser);

module.exports = router;
