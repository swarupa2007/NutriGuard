const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const Product = require("./models/Product");
const products = require("./data/products");

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Products inserted successfully");

    await mongoose.connection.close();

  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedProducts();