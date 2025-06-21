const transactionModel = require("../models/transactionModel");

exports.getStatement = async (req, res, next) => {
  try {
    const result = await transactionModel.getUserTransactions(req.user.id);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
