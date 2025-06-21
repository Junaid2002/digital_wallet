const userModel = require("../models/userModel");
const transactionModel = require("../models/transactionModel");
const axios = require("axios");

exports.fundAccount = async (req, res, next) => {
  try {
    const amt = parseFloat(req.body.amt);
    if (isNaN(amt) || amt <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const currentBal = parseFloat(req.user.balance);
    const updatedBal = currentBal + amt;

    await userModel.updateBalance(req.user.id, updatedBal);
    await transactionModel.addTransaction(req.user.id, "fund", amt, updatedBal);

    res.json({ balance: updatedBal });
  } catch (err) {
    console.error("Fund Error:", err);
    next(err);
  }
};

exports.payUser = async (req, res, next) => {
  try {
    const { to, amt } = req.body;
    const amount = parseFloat(amt);

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const senderBal = parseFloat(req.user.balance);
    if (senderBal < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    const toUserQuery = await userModel.getUserByUsername(to);
    const toUser = toUserQuery.rows[0];

    if (!toUser) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    const senderNewBal = senderBal - amount;
    const recipientNewBal = parseFloat(toUser.balance) + amount;

    await userModel.updateBalance(req.user.id, senderNewBal);
    await userModel.updateBalance(toUser.id, recipientNewBal);

    await transactionModel.addTransaction(req.user.id, "transfer", amount, senderNewBal);
    await transactionModel.addTransaction(toUser.id, "fund", amount, recipientNewBal);

    res.json({ balance: senderNewBal });
  } catch (err) {
    console.error("Payment Error:", err);
    next(err);
  }
};

exports.getBalance = async (req, res, next) => {
  try {
    const currency = req.query.currency;
    const bal = parseFloat(req.user.balance);

    if (currency && currency !== "INR") {
      const response = await axios.get("https://api.currencyapi.com/v3/latest", {
        params: {
          apikey: process.env.CURRENCY_API_KEY,
          base_currency: "INR",
          currencies: currency,
        },
      });

      const rate = response.data.data[currency]?.value;

      if (!rate) {
        return res.status(400).json({ error: "Currency conversion failed" });
      }

      const convertedBal = (bal * rate).toFixed(2);
      return res.json({ balance: convertedBal, currency });
    }

    res.json({ balance: bal, currency: "INR" });
  } catch (err) {
    console.error("Balance Error:", err);
    next(err);
  }
};

exports.getTransactionHistory = async (req, res, next) => {
  try {
    const result = await transactionModel.getUserTransactions(req.user.id);
    res.json(result.rows);
  } catch (err) {
    console.error("Transaction History Error:", err);
    next(err);
  }
};
