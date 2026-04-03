const {getAllTransactions,getTransactionById,createTransaction,updateTransaction,deleteTransaction} = require("../services/transactionService");
const { sendSuccess, sendPaginated } = require("../utils/responseHelper");

const fetchAllTransactions = async (req, res, next) => {
  try {
    const { transactions, pagination } = await getAllTransactions(req.query);
    return sendPaginated(
      res,
      200,
      "Transactions fetched successfully",
      transactions,
      pagination
    );
  } catch (error) {
    next(error);
  }
};

const fetchTransactionById = async (req, res, next) => {
  try {
    const transaction = await getTransactionById(req.params.id);
    return sendSuccess(res, 200, "Transaction fetched successfully", transaction);
  } catch (error) {
    next(error);
  }
};

const addTransaction = async (req, res, next) => {
  try {
    const transaction = await createTransaction(req.body, req.user.id);
    return sendSuccess(res, 201, "Transaction created successfully", transaction);
  } catch (error) {
    next(error);
  }
};

const editTransaction = async (req, res, next) => {
  try {
    const transaction = await updateTransaction(req.params.id, req.body);
    return sendSuccess(res, 200, "Transaction updated successfully", transaction);
  } catch (error) {
    next(error);
  }
};

const removeTransaction = async (req, res, next) => {
  try {
    await deleteTransaction(req.params.id);
    return sendSuccess(res, 200, "Transaction deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchAllTransactions,
  fetchTransactionById,
  addTransaction,
  editTransaction,
  removeTransaction
};