const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  category: {
    type: String,
  },

  barcode: {
    type: String,
  },

  brands: {
    type: String,
  },

 nutrition: {
  basis: { type: String, default: "100g" },
  calories: Number,
  carbohydrates: Number,
  totalSugar: Number,
  addedSugar: Number,
  fat: Number,
  saturatedFat: Number,
  transFat: Number,
  protein: Number,
  fiber: Number,
  sodiumMg: Number,
},
  ingredients: [
    {
      name: String,
      id: String,
      vegan: String,
      vegetarian: String,
      percentage: Number,
    },
  ],

  ingredientsText: {
    type: String,
  },

  additives: [String],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;