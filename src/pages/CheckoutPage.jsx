import React, { useState } from "react";
import { Heart, Share2, ChevronRight } from "lucide-react";

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("bulgandry muda");
  const [selectedSize, setSelectedSize] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const images = [
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
    "https://images.unsplash.com/photo-1578932750355-5eb30ece487a?w=400",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
    "https://images.unsplash.com/photo-1578932750355-5eb30ece487a?w=400",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
  ];

  const colors = [
    { name: "bulgandry tua", color: "bg-red-900" },
    { name: "bulgandry muda", color: "bg-red-400" },
    { name: "maroon", color: "bg-red-950" },
    { name: "cream", color: "bg-amber-100" },
    { name: "misty", color: "bg-gray-300" },
    { name: "gren lime", color: "bg-lime-500" },
    { name: "Hitam", color: "bg-black" },
    { name: "begie", color: "bg-amber-200" },
    { name: "hijau army", color: "bg-green-800" },
    { name: "denim", color: "bg-blue-600" },
    { name: "mins", color: "bg-teal-400" },
    { name: "navy", color: "bg-blue-900" },
    { name: "kubus", color: "bg-gray-500" },
    { name: "Lilac", color: "bg-purple-300" },
    { name: "dasty pink", color: "bg-pink-300" },
    { name: "hijau botol", color: "bg-green-700" },
    { name: "Olive", color: "bg-yellow-700" },
  ];

  const sizes = ["M", "L", "XL", "XXL"];

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Images */}
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
            <img
              src={images[selectedImage]}
              alt="Product"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
              Sale
            </span>
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index
                    ? "border-orange-500"
                    : "border-gray-200"
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
          <div className="flex items-center gap-4 pt-2">
            <span className="text-sm text-gray-600">Share:</span>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500">
                <Share2 size={16} />
              </button>
              <button className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700">
                f
              </button>
              <button className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600">
                P
              </button>
              <button className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800">
                ✕
              </button>
            </div>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="ml-auto flex items-center gap-2 text-gray-600 hover:text-red-500"
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
              <span className="text-sm">Favorit (895)</span>
            </button>
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="space-y-4">
          <div>
            <span className="inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded mb-2">
              Sale
            </span>
            <h1 className="text-xl font-medium text-gray-800 leading-tight">
              SWEATER HOODIE PULL AND BEAR JACKET PULLOVER SABLON EMBOSSED FONT
              TIMBUL HODIE PRIA WANITA UNISEX COD
            </h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-medium">4.8</span>
              <div className="flex text-yellow-400">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
            </div>
            <div className="text-gray-500">1,4RB Penilaian</div>
            <div className="text-gray-500">4RB+ Terjual ⓘ</div>
          </div>

          <button className="text-sm text-gray-600 hover:text-gray-800">
            Laporkan
          </button>

          {/* Price */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-orange-600">
                Rp59.900
              </span>
              <span className="text-3xl font-bold text-orange-600">-</span>
              <span className="text-3xl font-bold text-orange-600">
                Rp72.000
              </span>
              <span className="text-gray-400 line-through text-sm">
                Rp150.000
              </span>
              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                -60%
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded font-medium">
                12.12
              </span>
              <span className="text-gray-700">
                Spesial 12 Des <span className="font-medium">Rp70.500</span>{" "}
                00:00, 12 Des
              </span>
            </div>
          </div>

          {/* Shipping */}
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-gray-600 min-w-[100px]">Pengiriman</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-gray-800">
                  <span>🚚</span>
                  <span>Garansi tiba 12 - 14 Desember</span>
                  <ChevronRight size={16} />
                </div>
                <div className="text-gray-500 mt-1">
                  Dapatkan Voucher s/d Rp10.000 jika pesanan terlambat.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-600 min-w-[100px]">
                Jaminan Shopee
              </span>
              <div className="flex items-center gap-2 text-gray-800">
                <span>❤️</span>
                <span>COD-Cek Dulu</span>
                <span>Proteksi Kerusakan +</span>
                <ChevronRight size={16} />
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <div className="text-sm text-gray-600 mb-3">Warna</div>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded border text-sm ${
                    selectedColor === color.name
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded ${color.color} border border-gray-300`}
                  ></div>
                  <span className="text-xs text-gray-700 truncate">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Ukuran</span>
              <button className="text-sm text-blue-600 flex items-center gap-1">
                Tabel Ukuran <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="flex gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-2 rounded border text-sm font-medium ${
                    selectedSize === size
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
