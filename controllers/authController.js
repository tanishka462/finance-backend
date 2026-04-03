const { registerUser, loginUser } = require("../services/authService");
const { sendSuccess } = require("../utils/responseHelper");
const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    return sendSuccess(res, 201, "User registered successfully", result);
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    return sendSuccess(res, 200, "Login successful", result);
  } catch (error) {
    next(error);
  }
};
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, "User fetched successfully", req.user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};