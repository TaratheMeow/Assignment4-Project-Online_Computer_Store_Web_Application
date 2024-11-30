// backend/routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Products");

// 获取所有产品
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

module.exports = router;