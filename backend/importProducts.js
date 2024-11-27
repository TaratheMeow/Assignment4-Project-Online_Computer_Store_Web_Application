require("dotenv").config(); // 加载环境变量
const mongoose = require("mongoose");
const Product = require("./models/Products");
const fs = require("fs");
const path = require("path");

// MongoDB 连接
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// 读取 JSON 文件
const filePath = path.join(__dirname, "source/json/products.json");
const productsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// 更新或插入数据到数据库
const importData = async () => {
  try {
    for (const product of productsData) {
      // 设置图片路径为前端可访问的 URL
      const imagePath = `source/img/product${product.id}.jpeg`;

      await Product.updateOne(
        { id: product.id }, // 查找条件
        {
          $set: {
            name: product.name,
            price: product.price,
            image: imagePath, // 使用前端可访问的路径
            manufacturer: product.manufacturer,
            category: product.category,
            description: product.description,
            inventory: product.inventory,
            createdAt: new Date(), // 或者使用 product.createdAt
          },
        },
        { upsert: true } // 如果不存在则插入
      );
    }
    console.log("Data imported successfully");
    process.exit();
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

importData();
