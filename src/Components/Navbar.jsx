import { CodeXml, MessageCircle, ShoppingBag } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 border border-gray-500 bg-white/80 z-50 backdrop-blur-md">
      {/*div pembungkus*/}
      <div className="flex max-w-7xl mx-auto justify-between h-16 items-center px-4 ">
        {/*div logo*/}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <img className="size-12 gap-4 " src="/logo.png" alt="Logo" />
          <h1 className="font-bold text-xl text-blue-950">ALVI.THRIFT.SHOP.</h1>
        </div>
        
        {/* Search Input */}
        <label className="input input-bordered flex items-center gap-2 bg-white rounded-full px-4 h-10 w-full max-w-xs ml-4">
          <svg
            className="h-4 w-4 opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input 
            type="search" 
            className="grow outline-none bg-transparent" 
            placeholder="Cari produk..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </label>

        <ul className="hidden md:flex gap-8 items-center ml-auto mr-6">
          <li>
            <a href="/" className="hover:text-blue-600 transition font-medium text-gray-700">
              Home
            </a>
          </li>
          <li>
            <a href="/shop" className="hover:text-blue-600 transition font-medium text-gray-700">
              Shop
            </a>
          </li>
          <li>
            <a href="/about" className="hover:text-blue-600 transition font-medium text-gray-700">
              About
            </a>
          </li>
          <li>
            <a href="/kontak" className="hover:text-blue-600 transition font-medium text-gray-700">
              Contact
            </a>
          </li>
          <li>
            <a href="/cart" className="hover:text-blue-600 transition text-gray-700 relative">
              <ShoppingBag size={22} />
            </a>
          </li>
          <li>
            <a href="/pesan" className="hover:text-blue-600 transition text-gray-700">
              <MessageCircle size={22} />
            </a>
          </li>
        </ul>
        <a
          href="#"
          className="bg-blue-950 px-5 py-2 text-white rounded-full hover:bg-blue-800 transition font-medium shadow-md"
        >
          Login
        </a>
      </div>
    </header>
  );
}

export default Navbar;
