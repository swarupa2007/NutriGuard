const {
  getProductByBarcode,
} = require("./services/openFoodFactsService");

const normalizeProduct = require("./services/productNormalizer");

async function test() {
  try {

    const data = await getProductByBarcode("3017620422003");

    const product = normalizeProduct(data);

    console.log("\n========== NORMALIZED PRODUCT ==========\n");

    console.log(JSON.stringify(product, null, 2));

  } catch (error) {

    console.error("Error:", error.message);

  }
}

test();