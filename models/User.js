const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name cannot be empty" },
        len: {
          args: [2, 100],
          msg: "Name must be between 2 and 100 characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Please provide a valid email" },
        notEmpty: { msg: "Email cannot be empty" },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password cannot be empty" },
        len: {
          args: [6, 255],
          msg: "Password must be at least 6 characters",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("viewer", "analyst", "admin"),
      allowNull: false,
      defaultValue: "viewer",
      validate: {
        isIn: {
          args: [["viewer", "analyst", "admin"]],
          msg: "Role must be viewer, analyst, or admin",
        },
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: {
        attributes: {},
      },
    },
  }
);

module.exports = User;