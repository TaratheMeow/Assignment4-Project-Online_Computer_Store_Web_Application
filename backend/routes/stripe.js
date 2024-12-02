// backend/routes/stripe.js
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const auth = require("../middleware/auth");

router.post("/stripe-checkout", auth, async (req, res) => {
  try {
    const { items, tax, shipping, total } = req.body;
    const userId = req.user.id;

    // create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        ...items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Tax (13%)",
            },
            unit_amount: Math.round(tax * 100),
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Shipping Fee",
            },
            unit_amount: Math.round(shipping * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/success.html`,
      cancel_url: `http://localhost:3000/dashboard`,
    });

    const order = new Order({
      userId: userId,
      items: items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      tax: tax,
      shipping: shipping,
      total: total,
      paymentId: session.id,
      status: "pending",
    });

    await order.save();
    console.log("Order created:", order);

    res.json(session.url);
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

module.exports = router;
