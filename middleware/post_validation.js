async function postValidator(req, res, next) {
  const body = await req.body;
  const bodyArr = Object.keys(body);

  if (bodyArr.length !== 2) {
    return res.status(400).send({ status: 400, msg: "invalid object" });
  } else if (!bodyArr.includes("body") || !bodyArr.includes("username")) {
    return res.status(400).send({ msg: "invalid properties" });
  } else if (
    typeof body.username !== "string" ||
    typeof body.body !== "string"
  ) {
    return res.status(400).send({ msg: "invalid value data-type" });
  } else {
    return next();
  }
}

module.exports = postValidator;
