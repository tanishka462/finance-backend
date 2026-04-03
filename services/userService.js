const { User } = require("../models");
const { AppError } = require("../utils/responseHelper");
const getAllUsers = async (query) => {
  const { page = 1, limit = 10, role, is_active } = query;

  const offset = (page - 1) * limit;
  const whereConditions = {};

  if (role) {
    whereConditions.role = role;
  }

  if (is_active !== undefined) {
    whereConditions.is_active = is_active === "true";
  }

  const { count, rows } = await User.findAndCountAll({
    where: whereConditions,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["created_at", "DESC"]],
  });

  return {
    users: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
    },
  };
};

const getUserById = async (id) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

const updateUser = async (id, data, currentUserId) => {
  const { name, role, is_active } = data;

  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (id === currentUserId && is_active === false) {
    throw new AppError("You cannot deactivate your own account", 400);
  }

  if (id === currentUserId && role && role !== user.role) {
    throw new AppError("You cannot change your own role", 400);
  }

  if (name !== undefined) user.name = name;
  if (role !== undefined) user.role = role;
  if (is_active !== undefined) user.is_active = is_active;

  await user.save();

  return user;
};

const deleteUser = async (id, currentUserId) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (id === currentUserId) {
    throw new AppError("You cannot delete your own account", 400);
  }

  await user.destroy();

  return true;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};