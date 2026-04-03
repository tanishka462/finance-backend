const { Op } = require("sequelize");
const { Transaction, User } = require("../models");
const { AppError } = require("../utils/responseHelper");
const getAllTransactions = async (query) => {
  const {
    page = 1,
    limit = 10,
    type,
    category,
    start_date,
    end_date,
  } = query;

  const offset = (parseInt(page) - 1) * parseInt(limit);
    const whereConditions = {};

  if (type) {
    whereConditions.type = type;
  }

  if (category) {
    whereConditions.category = { [Op.like]: `%${category}%` };
  }
    if (start_date && end_date) {
    whereConditions.date = {
      [Op.between]: [start_date, end_date],
    };
  } else if (start_date) {
    whereConditions.date = {
      [Op.gte]: start_date,
    };
  } else if (end_date) {
    whereConditions.date = {
      [Op.lte]: end_date,
    };
  }
    const { count, rows } = await Transaction.findAndCountAll({
    where: whereConditions,
    limit: parseInt(limit),
    offset,
    order: [["date", "DESC"]],
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "name", "email"],
      },
    ],
  });

  return {
    transactions: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
    },
  };
};
const getTransactionById = async (id) => {
  const transaction = await Transaction.findByPk(id, {
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "name", "email"],
      },
    ],
  });

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  return transaction;
};
const createTransaction = async (data, userId) => {
  const { amount, type, category, date, notes } = data;

  const transaction = await Transaction.create({
    amount,
    type,
    category,
    date,
    notes,
    created_by: userId,
  });

  return transaction;
};
const updateTransaction = async (id, data) => {
  const transaction = await Transaction.findByPk(id);

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  const { amount, type, category, date, notes } = data;

  if (amount !== undefined) transaction.amount = amount;
  if (type !== undefined) transaction.type = type;
  if (category !== undefined) transaction.category = category;
  if (date !== undefined) transaction.date = date;
  if (notes !== undefined) transaction.notes = notes;

  await transaction.save();

  return transaction;
};

const deleteTransaction = async (id) => {
  const transaction = await Transaction.findByPk(id);

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  transaction.is_deleted = true;
  await transaction.save();

  return true;
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};