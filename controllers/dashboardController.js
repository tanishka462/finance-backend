const {getSummary,getCategoryWiseTotals,getMonthlyTrends,getRecentTransactions} = require("../services/dashboardService");
const { sendSuccess } = require("../utils/responseHelper");
const fetchSummary = async (req, res, next) => {
  try {
    const summary = await getSummary();
    return sendSuccess(res, 200, "Summary fetched successfully", summary);
  } catch (error) {
    next(error);
  }
};
const fetchCategoryWiseTotals = async (req, res, next) => {
  try {
    const categories = await getCategoryWiseTotals();
    return sendSuccess(res, 200, "Category wise totals fetched successfully", categories);
  } catch (error) {
    next(error);
  }
};
const fetchMonthlyTrends = async (req, res, next) => {
  try {
    const trends = await getMonthlyTrends();
    return sendSuccess(res, 200, "Monthly trends fetched successfully", trends);
  } catch (error) {
    next(error);
  }
};
const fetchRecentTransactions = async (req, res, next) => {
  try {
    const limit = req.query.limit || 10;
    const transactions = await getRecentTransactions(limit);
    return sendSuccess(res, 200, "Recent transactions fetched successfully", transactions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchSummary,
  fetchCategoryWiseTotals,
  fetchMonthlyTrends,
  fetchRecentTransactions
};