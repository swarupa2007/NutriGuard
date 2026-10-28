function normalizeProduct(data) {

  const product = data.product;

  if (!product) {
    throw new Error("Invalid product data");
  }

  const nutriments = product.nutriments || {};

  return {
    name: product.product_name || "Unknown Product",

    description: product.generic_name || "",

    category: product.categories || "",

    barcode: product.code || "",

    brands: product.brands || "",

    nutrition: {
      basis: "100g",

      calories:
        nutriments["energy-kcal_100g"] ?? null,

      carbohydrates:
        nutriments["carbohydrates_100g"] ?? null,

      totalSugar:
        nutriments["sugars_100g"] ?? null,

      addedSugar:
        nutriments["added-sugars_100g"] ?? null,

      fat:
        nutriments["fat_100g"] ?? null,

      saturatedFat:
        nutriments["saturated-fat_100g"] ?? null,

      protein:
        nutriments["proteins_100g"] ?? null,

      fiber:
        nutriments["fiber_100g"] ?? null,

      sodiumMg:
        nutriments["sodium_100g"] != null
          ? nutriments["sodium_100g"] * 1000
          : null,
    },

    ingredients: (product.ingredients || []).map(
      (ingredient) => ({
        name: ingredient.text || "",
        id: ingredient.id || "",
        vegan: ingredient.vegan || "unknown",
        vegetarian: ingredient.vegetarian || "unknown",
        percentage:
          ingredient.percent ??
          ingredient.percent_estimate ??
          null,
      })
    ),

    ingredientsText:
      product.ingredients_text || "",

    source: {
      name: "Open Food Facts",
      barcode: product.code || "",
    },
  };
}

module.exports = normalizeProduct;