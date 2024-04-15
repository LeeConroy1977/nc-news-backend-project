async function errorHandler(err, req, res, next) {
  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  }

  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Bad Request" });
  }

  return res.status(500).send({ msg: "Internal Server Error" });
}

module.exports = errorHandler;