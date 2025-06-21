const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const auth = require("../middlewares/auth");

router.post("/fund", auth, walletController.fundAccount);
router.post("/pay", auth, walletController.payUser);
router.get("/bal", auth, walletController.getBalance);
router.get("/history", auth, walletController.getTransactionHistory);

module.exports = router;
