const dns = require("dns");


dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");
const ocrRoutes = require("./routes/ocrRoutes");
const ingredientRoutes = require("./routes/ingredientRoutes");
const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/ingredients", ingredientRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "NutriGuard backend is running",
  });
});
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });
// Start server
app.listen(PORT, () => {
  console.log(`NutriGuard backend running on http://localhost:${PORT}`);
});