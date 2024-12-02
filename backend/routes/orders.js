const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const Product = require("../models/Products");

// get all orders (admin only)
router.get("/all", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "email");

    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

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
      latestOrder.status = "completed";
      await latestOrder.save();

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

router.put("/:id/cancel", auth, async (req, res) => {
  try {
    // check
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    // restore inventory
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

    // update order status
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
