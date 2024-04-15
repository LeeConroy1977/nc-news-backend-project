async function errorHandler(err, req, res, next) {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }

  res.status(500).send({ msg: "Internal Server Error" });
}

module.exports = errorHandler;
