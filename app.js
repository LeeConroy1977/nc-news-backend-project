const express = require("express");
const app = express();
const errorHandler = require("./middleware/error_middleware");
const topicsRouter = require("./routes/topics_router");
const apiRouter = require("./routes/api_router");

app.use(express.json());

// Routes

app.use("/api", apiRouter);
app.use("/api/topics", topicsRouter);

// Error middleware
app.use(errorHandler);

module.exports = app;
