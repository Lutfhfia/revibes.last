import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDatabase } from "../context/DatabaseContext";

export default function ShopPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const { products } = useDatabase();
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerQuery) ||
          product.category.toLowerCase().includes(lowerQuery)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-blue-950">
          Koleksi Alvi Thrift Store
        </h2>
        {searchQuery && (
          <p className="text-gray-600">
            Hasil pencarian untuk: <span className="font-semibold">"{searchQuery}"</span>
          </p>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-2xl text-gray-500">Produk tidak ditemukan.</h3>
          <button 
            onClick={() => navigate('/shop')}
            className="mt-4 px-6 py-2 bg-blue-950 text-white rounded-full hover:bg-blue-800 transition"
          >
            Lihat Semua Produk
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col group cursor-pointer"
              onClick={() => navigate("/checkout", { state: { product } })}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-blue-950 rounded-full shadow-sm">
                  {product.category}
                </span>
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h4>
                <p className="text-blue-950 font-bold text-xl mt-auto mb-4">
                  Rp{product.price.toLocaleString("id-ID")}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/checkout", { state: { product } });
                  }}
                  className="w-full py-3 bg-blue-950 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors duration-200 shadow-md flex justify-center items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Beli Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
