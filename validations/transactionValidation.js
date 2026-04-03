const { body, query, validationResult } = require("express-validator");
const { sendError } = require("../utils/responseHelper");
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return sendError(res, 400, "Validation failed", formattedErrors);
  }
  next();
};
const createTransactionValidation = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),

  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Category must be between 2 and 100 characters"),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isDate()
    .withMessage("Please provide a valid date (YYYY-MM-DD)")
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error("Transaction date cannot be in the future");
      }
      return true;
    }),

  body("notes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),

  validate,
];

const updateTransactionValidation = [
  body("amount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),

  body("type")
    .optional()
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),

  body("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Category must be between 2 and 100 characters"),

  body("date")
    .optional()
    .isDate()
    .withMessage("Please provide a valid date (YYYY-MM-DD)")
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error("Transaction date cannot be in the future");
      }
      return true;
    }),

  body("notes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),

  validate,
];
const filterTransactionValidation = [
  query("type")
    .optional()
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("start_date")
    .optional()
    .isDate()
    .withMessage("Start date must be a valid date (YYYY-MM-DD)"),

  query("end_date")
    .optional()
    .isDate()
    .withMessage("End date must be a valid date (YYYY-MM-DD)"),

  validate,
];

module.exports = {
  createTransactionValidation,
  updateTransactionValidation,
  filterTransactionValidation,
};