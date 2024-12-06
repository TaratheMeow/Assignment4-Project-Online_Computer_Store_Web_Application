require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Products");
const fs = require("fs");
const path = require("path");

// connect to MongoDB
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

// read initial json file
const filePath = path.join(__dirname, "source/json/products.json");
const productsData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// update or insert data to database
const importData = async () => {
  try {
    for (const product of productsData) {
      const imagePath = `source/img/product${product.id}.jpeg`;

      await Product.updateOne(
        { id: product.id },
        {
          $set: {
            name: product.name,
            price: product.price,
            image: imagePath,
            manufacturer: product.manufacturer,
            category: product.category,
            description: product.description,
            inventory: product.inventory,
            createdAt: new Date(),
          },
        },
        { upsert: true } // if not exist, insert
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
