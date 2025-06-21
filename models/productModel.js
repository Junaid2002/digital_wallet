const db = require("../db/db");

exports.addProduct = (name, price, description) => {
  return db.query("INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *", [name, price, description]);
};

exports.getAllProducts = () => {
  return db.query("SELECT * FROM products");
};

exports.getProductById = (id) => {
  return db.query("SELECT * FROM products WHERE id = $1", [id]);
};
