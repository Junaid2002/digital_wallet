const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const auth = require("../middlewares/auth");

router.post("/product", auth, productController.addProduct);
router.get("/product", productController.listProducts);
router.post("/buy", auth, productController.buyProduct);

module.exports = router;
