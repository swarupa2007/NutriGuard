const products = [
  {
    id: 1,
    name: "Oreo",
    description: "Chocolate Sandwich Cookies",
    category: "Biscuits",

    nutrition: {
      servingSize: "3 cookies",
      servingSizeGrams: 34,

      perServing: {
        calories: 160,
        carbohydrates: 25,
        totalSugar: 14,
        addedSugar: 12,
        fat: 7,
        sodium: 115,
      },
    },

    ingredients: [
      "Wheat Flour",
      "Sugar",
      "Palm Oil",
      "Cocoa",
      "Leavening Agents",
      "Soy Lecithin",
      "Artificial Flavor",
    ],

    additives: [
      "Artificial Flavor",
    ],
  },

  {
    id: 2,
    name: "Maggi",
    description: "Instant Noodles",
    category: "Instant Food",

    nutrition: {
      servingSize: "1 pack",
      servingSizeGrams: 70,

      perServing: {
        calories: 310,
        carbohydrates: 44,
        totalSugar: 2,
        addedSugar: 0,
        fat: 13,
        sodium: 900,
      },
    },

    ingredients: [
      "Wheat Flour",
      "Palm Oil",
      "Salt",
      "Spices",
      "Flavour Enhancers",
    ],

    additives: [
      "Flavour Enhancers",
    ],
  },

  {
    id: 3,
    name: "Coca Cola",
    description: "Carbonated Soft Drink",
    category: "Beverage",

    nutrition: {
      servingSize: "1 bottle",
      servingSizeGrams: 500,

      perServing: {
        calories: 210,
        carbohydrates: 39,
        totalSugar: 39,
        addedSugar: 39,
        fat: 0,
        sodium: 30,
      },
    },

    ingredients: [
      "Carbonated Water",
      "Sugar",
      "Caramel Colour",
      "Phosphoric Acid",
      "Natural Flavouring",
    ],

    additives: [
      "Caramel Colour",
    ],
  },
];

export default products;