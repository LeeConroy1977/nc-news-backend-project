const express = require("express");
const app = express();
const errorHandler = require("./middleware/error.middleware");
const topicsRouter = require("./routes/topics.route");

app.use(express.json());

// Routes

app.use("/api/topics", topicsRouter);

// Error middleware
app.use(errorHandler);

module.exports = app;
