// backend/routes/stripe.js
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/stripe-checkout", async (req, res) => {
  try {
    const { items } = req.body;

    // 创建 Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [`http://localhost:5000/${item.image}`],
          },
          unit_amount: Math.round(item.price * 100), // Stripe 使用分为单位
        },
        quantity: item.quantity,
      })),
      success_url: `http://localhost:3000/success.html`,
      cancel_url: `http://localhost:3000/dashboard`,
    });

    res.json(session.url);
  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ error: "Failed to create checkout session: " +  error });
  }
});

module.exports = router;
