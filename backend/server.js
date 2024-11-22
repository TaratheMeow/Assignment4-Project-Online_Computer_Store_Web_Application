const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();
const rateLimit = require("express-rate-limit");

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
});

app.use("/api/auth", limiter);

// 连接数据库
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB Atlas");

    try {
      // 检查是否已存在管理员账号
      const adminExists = await User.findOne({ role: "admin" });
      console.log("Checking admin account:", adminExists);

      if (!adminExists) {
        // 创建默认管理员账号
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        const adminUser = new User({
          email: "admin@example.com",
          password: hashedPassword,
          role: "admin",
        });

        try {
          await adminUser.save();
          console.log("Default admin account created successfully");

          // 验证管理员账户是否真的创建成功
          const verifyAdmin = await User.findOne({ role: "admin" });
          console.log("Verified admin account:", verifyAdmin);
        } catch (error) {
          console.error("Error creating admin account:", error);
          console.error("Full error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
          });
        }
      } else {
        console.log("Admin account already exists:", {
          email: adminExists.email,
          role: adminExists.role,
        });
      }
    } catch (error) {
      console.error("Error during admin check/creation:", error);
    }
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err);
    console.error("Full connection error details:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  });

// 路由
app.use("/api/auth", require("./routes/auth"));

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
