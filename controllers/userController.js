const {getAllUsers,getUserById,updateUser,deleteUser} = require("../services/userService");
const { sendSuccess, sendPaginated } = require("../utils/responseHelper");
const fetchAllUsers = async (req, res, next) => {
  try {
    const { users, pagination } = await getAllUsers(req.query);
    return sendPaginated(res, 200, "Users fetched successfully", users, pagination);
  } catch (error) {
    next(error);
  }
};
const fetchUserById = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    return sendSuccess(res, 200, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const user = await updateUser(req.params.id, req.body, req.user.id);
    return sendSuccess(res, 200, "User updated successfully", user);
  } catch (error) {
    next(error);
  }
};
const deleteUserById = async (req, res, next) => {
  try {
    await deleteUser(req.params.id, req.user.id);
    return sendSuccess(res, 200, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchAllUsers,
  fetchUserById,
  updateUserById,
  deleteUserById
};