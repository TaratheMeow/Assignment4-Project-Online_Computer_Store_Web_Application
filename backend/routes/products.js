// backend/routes/products.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Product = require("../models/Products");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    try {
      const fakeStoreResponse = await fetch(
        "https://fakestoreapi.com/products?limit=8"
      );
      const fakeStoreProducts = await fakeStoreResponse.json();

      const productsWithRatings = products.map((product, index) => ({
        ...product.toObject(),
        rating: fakeStoreProducts[index]?.rating?.rate || 4.0,
      }));

      res.json(productsWithRatings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      res.json(products);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

//update
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // check id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
});

module.exports = router;
