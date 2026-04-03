const { Sequelize } = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging:
      process.env.NODE_ENV === "development"
        ? (msg) => console.log(`[Sequelize]: ${msg}`)
        : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: true,
      timestamps: true,
    },
  }
);
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("Database synced successfully.");
    }
  } catch (error) {
    console.error("Unable to connect to the database:");
    console.error(`Error: ${error.message}`);

    if (error.original) {
      console.error(`Original Error: ${error.original.message}`);
    }
    process.exit(1);
  }
};
module.exports = { sequelize, connectDB };