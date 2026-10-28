async function getProductByBarcode(barcode) {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v3/product/${barcode}?product_type=food`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch product from Open Food Facts");
  }

  const data = await response.json();

  return data;
}


async function searchProductByName(name) {
  const response = await fetch(
    `https://search.openfoodfacts.org/search?q=${encodeURIComponent(name)}`
  );

  if (!response.ok) {
    throw new Error("Failed to search product from Open Food Facts");
  }

  const data = await response.json();

  if (!data.hits || data.hits.length === 0) {
    throw new Error("Product not found in Open Food Facts");
  }

  const productCode = data.hits[0].code;

  if (!productCode) {
    throw new Error("Product barcode not available");
  }

  return getProductByBarcode(productCode);
}


module.exports = {
  getProductByBarcode,
  searchProductByName,
};