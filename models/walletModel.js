const db = require("../db/db");

exports.getWalletByUserId = (userId) => {
  return db.query("SELECT * FROM wallets WHERE user_id = $1", [userId]);
};

exports.updateBalance = (userId, newBalance) => {
  return db.query("UPDATE wallets SET balance = $1 WHERE user_id = $2", [newBalance, userId]);
};
