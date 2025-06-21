const db = require("../db/db");

exports.addTransaction = (userId, type, amount, balance) => {
  return db.query(
    `INSERT INTO transactions (user_id, type, amount, balance, created_at)
     VALUES ($1, $2, $3, $4, NOW())`,
    [userId, type, amount, balance]
  );
};

exports.getUserTransactions = (userId) => {
  return db.query(
    `SELECT type, amount, balance, created_at
     FROM transactions
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
};
