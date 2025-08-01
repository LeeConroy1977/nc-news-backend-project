function errorHandler(err, req, res, next) {
  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  }

  if (err.message === "Article does not exist") {
    return res.status(404).send({ msg: "Article does not exist" });
  }

  if (err.code === "23502") {
    return res.status(400).send({ msg: "Invalid Object" });
  }

  if (err.code === "23503") {
    return res.status(404).send({ msg: "Article cannot be found" });
  }

  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Bad Request" });
  }

  if (err.code === "42703") {
    return res.status(400).send({ msg: "Invalid Object" });
  }

  console.error(err);
  return res.status(500).send({ msg: "Internal Server Error" });
}

module.exports = errorHandler;
