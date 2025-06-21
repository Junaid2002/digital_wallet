const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const auth = require("../middlewares/auth");

router.get("/stmt", auth, transactionController.getStatement);

module.exports = router;