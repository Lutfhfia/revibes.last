import db from './db.js';

const originalProducts = [
  {
    name: "Adidas Rework",
    price: 299000,
    image: "/9.png",
    category: "Hoodie"
  },
  {
    name: "Denim Work Shirt",
    price: 319000,
    image: "/11.png",
    category: "Shirt"
  },
  {
    name: "Puma Hoodie",
    price: 289000,
    image: "/5.png",
    category: "Hoodie"
  },
  {
    name: "Uniqlo Hodie Basic Navy",
    price: 339000,
    image: "/7.png",
    category: "Hoodie"
  },
  {
    name: "Nike Hodie Black",
    price: 339000,
    image: "/13.png",
    category: "Hoodie"
  },
  {
    name: "Rework Painting",
    price: 300000,
    image: "/2(1).png",
    category: "Jacket"
  },
  {
    name: "Croptop Spider Painting",
    price: 350000,
    image: "/crop.png",
    category: "Croptop"
  }
];

async function fixProducts() {
  try {
    // Empty the products table
    await db.query('TRUNCATE TABLE products');
    
    // Insert the correct ones
    for (let p of originalProducts) {
      await db.query(
        'INSERT INTO products (name, price, category, image) VALUES (?, ?, ?, ?)',
        [p.name, p.price, p.category, p.image]
      );
    }
    
    console.log("Products have been restored to original images.");
    process.exit(0);
  } catch (error) {
    console.error("Error fixing products:", error);
    process.exit(1);
  }
}

fixProducts();
