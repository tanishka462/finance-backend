const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const { sendError } = require("./utils/responseHelper");
const { limiter } = require("./middlewares/rateLimiter");
const app = express();
app.use(helmet());
app.use(limiter);
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Finance Backend API is running",
    environment: process.env.NODE_ENV,
  });
});
app.use((req, res) => {
  return sendError(res, 404, `Route ${req.originalUrl} not found`);
});
app.use(errorHandler);
module.exports = app;