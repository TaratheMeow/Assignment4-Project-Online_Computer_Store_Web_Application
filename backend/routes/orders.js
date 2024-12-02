const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const Product = require("../models/Product"); // 不是 Products

router.get("/history", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.post("/update-status", auth, async (req, res) => {
  try {
    const latestOrder = await Order.findOne({
      userId: req.user.id,
      status: "pending",
    }).sort({ createdAt: -1 });

    if (latestOrder) {
      // 更新订单状态
      latestOrder.status = "completed";
      await latestOrder.save();

      // 更新商品库存
      for (const item of latestOrder.items) {
        const product = await Product.findOne({ name: item.name });
        if (product) {
          product.inventory -= item.quantity;
          await product.save();
          console.log(
            `Updated inventory for ${item.name}: ${product.inventory}`
          );
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
