const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Amount must be a valid number" },
        min: {
          args: [0.01],
          msg: "Amount must be greater than 0",
        },
        notNull: { msg: "Amount is required" },
      },
    },
    type: {
      type: DataTypes.ENUM("income", "expense"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["income", "expense"]],
          msg: "Type must be income or expense",
        },
        notNull: { msg: "Type is required" },
      },
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Category cannot be empty" },
        len: {
          args: [2, 100],
          msg: "Category must be between 2 and 100 characters",
        },
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { msg: "Please provide a valid date" },
        notNull: { msg: "Date is required" },
        isNotFuture(value) {
          if (new Date(value) > new Date()) {
            throw new Error("Transaction date cannot be in the future");
          }
        },
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: "Notes cannot exceed 500 characters",
        },
      },
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        isUUID: { args: 4, msg: "Invalid user reference" },
        notNull: { msg: "Creator reference is required" },
      },
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: "transactions",
    timestamps: true,
    underscored: true,
    defaultScope: {
      where: { is_deleted: false },
    },
    scopes: {
      withDeleted: {
        where: {},
      },
    },
  }
);
module.exports = Transaction;