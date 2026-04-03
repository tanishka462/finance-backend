const { AppError } = require("../utils/responseHelper");

const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return next(new AppError("You are not logged in. Please login to get access", 401));
      }

      if (!roles.includes(req.user.role)) {
        return next(new AppError("You do not have permission to perform this action", 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { authorize };