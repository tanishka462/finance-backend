const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { AppError } = require("../utils/responseHelper");
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const registerUser = async (data) => {
  const { name, email, password, role } = data;
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "viewer",
  });

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    },
    token,
  };
};

const loginUser = async (data) => {
  const { email, password } = data;

  const user = await User.scope("withPassword").findOne({ where: { email } });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }


  if (!user.is_active) {
    throw new AppError("Your account has been deactivated. Please contact admin", 403);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    },
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};