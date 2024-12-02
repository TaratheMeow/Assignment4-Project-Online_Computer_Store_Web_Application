const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const Product = require("../models/Product");

// 获取所有订单（管理员专用）
router.get("/all", auth, async (req, res) => {
  try {
    // 检查是否是管理员
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // 获取所有订单并按创建时间倒序排列
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "email"); // 可选：关联用户信息

    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// 获取用户订单历史（现有的路由）
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

// 更新订单状态（现有的路由）
router.post("/update-status", auth, async (req, res) => {
  try {
    const latestOrder = await Order.findOne({
      userId: req.user.id,
      status: "pending",
    }).sort({ createdAt: -1 });

    if (latestOrder) {
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

// 取消订单
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    // 检查是否是管理员
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { id } = req.params;
    const { reason } = req.body; // 可选：接收取消原因

    // 查找并更新订单
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    // 恢复库存
    for (const item of order.items) {
      const product = await Product.findOne({ name: item.name });
      if (product) {
        product.inventory += item.quantity;
        await product.save();
        console.log(
          `Restored inventory for ${item.name}: ${product.inventory}`
        );
      }
    }

    // 更新订单状态和取消信息
    order.status = "cancelled";
    order.cancelledAt = new Date();
    if (reason) {
      order.cancelReason = reason;
    }
    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Error cancelling order" });
  }
});

module.exports = router;
