const { Op, fn, col, literal } = require("sequelize");
const { Transaction } = require("../models");
const getSummary = async () => {
  const result = await Transaction.findAll({
    attributes: [
      "type",
      [fn("SUM", col("amount")), "total"],
      [fn("COUNT", col("id")), "count"],
    ],
    group: ["type"],
  });

  let totalIncome = 0;
  let totalExpense = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  result.forEach((row) => {
    if (row.type === "income") {
      totalIncome = parseFloat(row.dataValues.total) || 0;
      incomeCount = parseInt(row.dataValues.count) || 0;
    } else if (row.type === "expense") {
      totalExpense = parseFloat(row.dataValues.total) || 0;
      expenseCount = parseInt(row.dataValues.count) || 0;
    }
  });

  return {
    total_income: totalIncome,
    total_expense: totalExpense,
    net_balance: totalIncome - totalExpense,
    income_count: incomeCount,
    expense_count: expenseCount,
    total_transactions: incomeCount + expenseCount,
  };
};
const getCategoryWiseTotals = async () => {
  const result = await Transaction.findAll({
    attributes: [
      "type",
      "category",
      [fn("SUM", col("amount")), "total"],
      [fn("COUNT", col("id")), "count"],
    ],
    group: ["type", "category"],
    order: [["type", "ASC"], [fn("SUM", col("amount")), "DESC"]],
  });
  const incomeCategories = [];
  const expenseCategories = [];

  result.forEach((row) => {
    const item = {
      category: row.category,
      total: parseFloat(row.dataValues.total) || 0,
      count: parseInt(row.dataValues.count) || 0,
    };

    if (row.type === "income") {
      incomeCategories.push(item);
    } else {
      expenseCategories.push(item);
    }
  });

  return {
    income_categories: incomeCategories,
    expense_categories: expenseCategories,
  };
};

const getMonthlyTrends = async () => {
  const result = await Transaction.findAll({
    attributes: [
      "type",
      [fn("YEAR", col("date")), "year"],
      [fn("MONTH", col("date")), "month"],
      [fn("SUM", col("amount")), "total"],
      [fn("COUNT", col("id")), "count"],
    ],
    group: ["type", "year", "month"],
    order: [
      [fn("YEAR", col("date")), "DESC"],
      [fn("MONTH", col("date")), "DESC"],
    ],
    limit: 24,
  });
  const trendsMap = {};

  result.forEach((row) => {
    const year = row.dataValues.year;
    const month = row.dataValues.month;
    const key = `${year}-${String(month).padStart(2, "0")}`;

    if (!trendsMap[key]) {
      trendsMap[key] = {
        month: key,
        income: 0,
        expense: 0,
        net: 0,
      };
    }

    if (row.type === "income") {
      trendsMap[key].income = parseFloat(row.dataValues.total) || 0;
    } else {
      trendsMap[key].expense = parseFloat(row.dataValues.total) || 0;
    }

    trendsMap[key].net = trendsMap[key].income - trendsMap[key].expense;
  });

  const trends = Object.values(trendsMap).sort((a, b) =>
    b.month.localeCompare(a.month)
  );

  return trends;
};
const getRecentTransactions = async (limit = 10) => {
  const transactions = await Transaction.findAll({
    order: [["date", "DESC"]],
    limit: parseInt(limit),
  });

  return transactions;
};

module.exports = {
  getSummary,
  getCategoryWiseTotals,
  getMonthlyTrends,
  getRecentTransactions,
};