const express = require("express");
const Product = require("../models/Product");

const {
  getProductByBarcode,
  searchProductByName,
} = require("../services/openFoodFactsService");
const normalizeProduct = require("../services/productNormalizer");

const router = express.Router();


// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch products",
    });

  }
});


// Get product using barcode
router.get("/barcode/:barcode", async (req, res) => {

  try {

    const barcode = req.params.barcode;

    // 1. Check MongoDB first
    const existingProduct = await Product.findOne({ barcode });

    if (existingProduct) {

      console.log("Product found in MongoDB");

      return res.json(existingProduct);

    }


    // 2. Product not found in MongoDB
    // Fetch from Open Food Facts
    console.log(
      "Product not found in MongoDB. Fetching from Open Food Facts..."
    );

    const data = await getProductByBarcode(barcode);


    // 3. Normalize Open Food Facts data
    const product = normalizeProduct(data);


    // 4. Save the normalized product to MongoDB
    const savedProduct = await Product.create(product);


    console.log(
      "Product fetched from Open Food Facts and saved to MongoDB"
    );


    // 5. Return product to frontend
    res.json(savedProduct);

  } catch (error) {

    console.error(
      "Barcode search failed:",
      error.message
    );

    res.status(404).json({
      message: "Product not found",
    });

  }

});


// Search product by name
router.get("/search", async (req, res) => {
  try {
    const searchName = req.query.name;

    // 1. Check MongoDB first
    const existingProduct = await Product.findOne({
      name: {
        $regex: `^${searchName}$`,
        $options: "i",
      },
    });

    if (existingProduct) {
      console.log("Product found in MongoDB");
      return res.json(existingProduct);
    }

    // 2. Product not found in MongoDB
    // Fetch from Open Food Facts
    console.log(
      "Product not found in MongoDB. Fetching from Open Food Facts..."
    );

    const data = await searchProductByName(searchName);

    // 3. Normalize Open Food Facts data
    const product = normalizeProduct(data);

    // 4. Save normalized product to MongoDB
    const savedProduct = await Product.create(product);

    console.log(
      "Product fetched from Open Food Facts and saved to MongoDB"
    );

    // 5. Return product to frontend
    res.json(savedProduct);
  } catch (error) {
    console.error(
      "Name search failed:",
      error.message
    );

    res.status(404).json({
      message: "Product not found",
    });
  }
});
module.exports = router;