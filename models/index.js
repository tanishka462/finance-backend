const { sequelize } = require("../config/database");
const User = require("./User");
const Transaction = require("./Transaction");
User.hasMany(Transaction, {
  foreignKey: "created_by",
  as: "transactions",
});
Transaction.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});
module.exports = {
  sequelize,
  User,
  Transaction,
};