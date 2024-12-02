const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// 中间件
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// MongoDB 连接
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// API 路由
app.use("/api/auth", require("./routes/auth")); // 确保路径正确
app.use("/api/products", require("./routes/products"));
app.use("/api", require("./routes/stripe"));
app.use("/api/orders", require("./routes/orders"));
app.use("/source/img", express.static(path.join(__dirname, "source/img")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
