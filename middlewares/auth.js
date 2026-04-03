const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { AppError } = require("../utils/responseHelper");
const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("You are not logged in. Please login to get access", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findByPk(decoded.id);

    if (!currentUser) {
      return next(new AppError("User belonging to this token no longer exists", 401));
    }

    if (!currentUser.is_active) {
      return next(new AppError("Your account has been deactivated. Please contact admin", 403));
    }
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect };