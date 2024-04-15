const express = require("express");
const { getApi } = require("../controllers/api_controller");

const router = express.Router();

router.route("/").get(getApi);

module.exports = router;
