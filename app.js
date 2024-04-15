const express = require("express");
const app = express();
const errorHandler = require("./middleware/error_middleware");
const topicsRouter = require("./routes/topics_router");
const apiRouter = require("./routes/api_router");
const articlesRouter = require("./routes/articles_router");

// Routes

app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api", apiRouter);

// Error middleware

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid Endpoint" });
});

app.use(errorHandler);

module.exports = app;