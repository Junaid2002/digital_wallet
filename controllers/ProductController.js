const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const transactionModel = require("../models/transactionModel");

exports.addProduct = async (req, res, next) => {
  try {
    const { name, price, description } = req.body;
    const product = await productModel.addProduct(name, price, description);
    res.status(201).json({ id: product.rows[0].id, message: "Product added" });
  } catch (err) {
    next(err);
  }
};

exports.listProducts = async (req, res, next) => {
  try {
    const result = await productModel.getAllProducts();
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.buyProduct = async (req, res, next) => {
  try {
    const { product_id } = req.body;
    const productResult = await productModel.getProductById(product_id);
    const product = productResult.rows[0];
    if (!product || req.user.balance < product.price) {
      return res.status(400).json({ error: "Insufficient balance or invalid product" });
    }
    const newBal = req.user.balance - product.price;
    await userModel.updateBalance(req.user.id, newBal);
    await transactionModel.addTransaction(req.user.id, "debit", product.price, newBal);
    res.json({ message: "Product purchased", balance: newBal });
  } catch (err) {
    next(err);
  }
};