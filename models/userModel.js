const db = require("../db/db");

exports.createUser = (name, email, passwordHash) => {
  return db.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
    [name, email, passwordHash]
  );
};

exports.getUserByName = (name) => {
  return db.query("SELECT * FROM users WHERE name = $1", [name]);
};

exports.getUserByUsername = (username) => {
  return db.query("SELECT * FROM users WHERE name = $1", [username]);
};

exports.updateBalance = (userId, newBalance) => {
  return db.query("UPDATE users SET balance = $1 WHERE id = $2", [newBalance, userId]);
};
