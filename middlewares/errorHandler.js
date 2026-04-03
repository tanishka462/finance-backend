const { sendError } = require("../utils/responseHelper");
const handleSequelizeValidationError = (error) => {
  const errors = error.errors.map((err) => ({
    field: err.path,
    message: err.message,
  }));
  return { statusCode: 400, message: "Validation failed", errors };
};
const handleSequelizeUniqueConstraintError = (error) => {
  const field = error.errors[0].path;
  const message = `${field} already exists`;
  return { statusCode: 409, message, errors: null };
};
const handleJWTError = () => ({
  statusCode: 401,
  message: "Invalid token. Please login again",
  errors: null,
});
const handleJWTExpiredError = () => ({
  statusCode: 401,
  message: "Token expired. Please login again",
  errors: null,
});

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errors = null;

  if (err.name === "SequelizeValidationError") {
    const result = handleSequelizeValidationError(err);
    statusCode = result.statusCode;
    message = result.message;
    errors = result.errors;
  }

  else if (err.name === "SequelizeUniqueConstraintError") {
    const result = handleSequelizeUniqueConstraintError(err);
    statusCode = result.statusCode;
    message = result.message;
  }

  else if (err.name === "SequelizeDatabaseError") {
    statusCode = 400;
    message = "Database error occurred";
  }

  else if (err.name === "SequelizeConnectionError") {
    statusCode = 503;
    message = "Database connection failed. Please try again later";
  }

  else if (err.name === "JsonWebTokenError") {
    const result = handleJWTError();
    statusCode = result.statusCode;
    message = result.message;
  }

  else if (err.name === "TokenExpiredError") {
    const result = handleJWTExpiredError();
    statusCode = result.statusCode;
    message = result.message;
  }

  if (process.env.NODE_ENV === "development") {
    console.error("ERROR:", {
      statusCode,
      message,
      stack: err.stack,
    });
  }

  return sendError(res, statusCode, message, errors);
};

module.exports = errorHandler;