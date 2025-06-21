const db = require("../db/db");

exports.addTransaction = (userId, kind, amt, updatedBal) => {
  return db.query(
    "INSERT INTO transactions (user_id, kind, amt, updated_bal) VALUES ($1, $2, $3, $4)",
    [userId, kind, amt, updatedBal]
  );
};

exports.getUserTransactions = (userId) => {
  return db.query(
    "SELECT kind, amt, updated_bal, timestamp FROM transactions WHERE user_id = $1 ORDER BY timestamp DESC",
    [userId]
  );
};
