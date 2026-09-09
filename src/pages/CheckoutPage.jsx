import React, { useState, useEffect } from "react";
import { Heart, Share2, ChevronRight, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const product = location.state?.product;

  // Redirect if accessed directly without product data
  useEffect(() => {
    if (!product) {
      navigate("/shop");
    }
  }, [product, navigate]);

  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [isFavorite, setIsFavorite] = useState(false);

  // Use the same image for thumbnails since we only have one image per product for now
  const images = [product.image, product.image, product.image];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Silakan pilih ukuran terlebih dahulu");
      return;
    }
    if (!selectedColor) {
      alert("Silakan pilih warna terlebih dahulu");
      return;
    }

    const savedCart = sessionStorage.getItem("thriftShopCart");
    const cart = savedCart ? JSON.parse(savedCart) : [];

    const newItem = {
      id: Date.now(), // unique ID for cart item
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      material: product.materials ? product.materials[0] : "Bahan standar",
      quantity: 1,
    };

    cart.push(newItem);
    sessionStorage.setItem("thriftShopCart", JSON.stringify(cart));
    
    // Redirect to cart
    navigate("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-600 hover:text-blue-950 mb-6 transition"
      >
        <ArrowLeft size={20} />
        Kembali ke Toko
      </button>

      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Side - Images */}
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square flex items-center justify-center">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-red-600 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm">
              Tersedia
            </span>
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? "border-blue-950 opacity-100"
                    : "border-gray-200 opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Share and Favorite */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Bagikan:</span>
              <div className="flex gap-2">
                <button className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex items-center gap-2 font-medium transition ${isFavorite ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            >
              <Heart size={24} fill={isFavorite ? "currentColor" : "none"} strokeWidth={isFavorite ? 0 : 2} />
              <span className="text-sm">Simpan</span>
            </button>
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="space-y-6">
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded mb-3">
              {product.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600">
              {product.description || "Produk thrift berkualitas yang telah dikurasi dan disiapkan khusus untuk Anda."}
            </p>
          </div>

          {/* Price */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-extrabold text-blue-950">
                Rp{product.price.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-green-600 bg-green-100 px-2 py-1 rounded font-medium flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Kondisi Sangat Baik
              </span>
              <span className="text-gray-500">
                • 1 Item Tersedia
              </span>
            </div>
          </div>

          <div className="space-y-5 py-4 border-t border-b border-gray-100">
            {/* Color Selection */}
            <div>
              <div className="text-sm font-semibold text-gray-800 mb-3 flex items-center justify-between">
                Warna <span className="font-normal text-gray-500 text-xs">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      selectedColor === color
                        ? "border-blue-950 bg-blue-50 text-blue-950 shadow-sm"
                        : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-800">Ukuran <span className="font-normal text-gray-500 text-xs ml-1">{selectedSize}</span></span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-blue-950 bg-blue-950 text-white shadow-sm"
                        : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Materials */}
            {product.materials && (
              <div>
                <span className="text-sm font-semibold text-gray-800">Bahan:</span>
                <span className="text-sm text-gray-600 ml-2">{product.materials.join(", ")}</span>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="w-full py-4 bg-blue-950 text-white font-bold text-lg rounded-xl hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex justify-center items-center gap-2 mt-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Masukkan ke Keranjang
          </button>
          
        </div>
      </div>
    </div>
  );
}
