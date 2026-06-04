import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ShopPage() {
  const navigate = useNavigate();

const products = [
  {
    id: 1,
    name: "Adidas Rework",
    price: 299000,
    image: "/9.png",
    category: "Hoodie",
    sizes: ["L", "XL"],
    colors: ["Black", "White"],
    materials: ["Cotton"],
  },
  {
    id: 2,
    name: "Denim Work Shirt",
    price: 319000,
    image: "/11.png",
    category: "Hoodie",
    sizes: ["L", "XL"],
    colors: ["Black", "White"],
    materials: ["Cotton"],
  },
  {
    id: 3,
    name: "Puma Hoodie",
    price: 289000,
    image: "/5.png",
    category: "Hoodie",
    sizes: ["S", "M", "L"],
    colors: ["Gray", "Black"],
    materials: ["Polyester"],
  },
  {
    id: 4,
    name: "Uniqlo Hodie Basic Navy",
    price: 339000,
    image: "/7.png",
    category: "Hoodie",
    sizes: ["L", "XL"],
    colors: ["Black", "White"],
    materials: ["Cotton"],
  },
  {
    id: 5,
    name: "Nike Hodie Black",
    price: 339000,
    image: "/13.png",
    category: "Hoodie",
    sizes: ["M", "L", "XL"],
    colors: ["Black", "White"],
    materials: ["Cotton"],
  },
  {
    id: 6,
    name: "Rework Painting",
    price: 300000,
    image: "/2(1).png",
    category: "Jacket",
    sizes: ["M", "L", "XL"],
    colors: ["Black", "White", "Blue"],
    materials: ["Cotton"],
  },
  {
    id: 7,
    name: "Croptop Spider Painting",
    price: 350000,
    image: "./crop.png",
    category: "Croptop",
    sizes: ["M", "L", "XL"],
    colors: ["Black", "White"],
    materials: ["Cotton"],
  },
];


  return (
    <div style={{ padding: "30px" }}>
      <h2>Alvi Thrift Store</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%" }}
            />
            <h4>{product.name}</h4>
            <p>Rp {product.price.toLocaleString()}</p>

            <button
              onClick={() =>
                navigate("/checkout", { state: { product } })
              }
              style={{
                width: "100%",
                padding: "10px",
                background: "black",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Beli Sekarang
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
