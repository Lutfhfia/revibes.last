import { MessageCircle, ShoppingBag, User } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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

        {currentUser?.role === 'admin' ? (
          <ul className="hidden md:flex gap-8 items-center ml-auto mr-6">
            <li>
              <Link to="/admin/dashboard" className="hover:text-blue-600 transition font-medium text-gray-700">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="hover:text-blue-600 transition font-medium text-gray-700">
                Pesanan
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="hover:text-blue-600 transition font-medium text-gray-700">
                Produk
              </Link>
            </li>
            <li>
              <Link to="/admin/chat" className="hover:text-blue-600 transition text-gray-700 relative flex items-center gap-1">
                <MessageCircle size={20} />
                <span className="font-medium">Pesan Masuk</span>
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="hidden md:flex gap-8 items-center ml-auto mr-6">
            <li>
              <Link to="/" className="hover:text-blue-600 transition font-medium text-gray-700">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-blue-600 transition font-medium text-gray-700">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-600 transition font-medium text-gray-700">
                About
              </Link>
            </li>
            <li>
              <Link to="/kontak" className="hover:text-blue-600 transition font-medium text-gray-700">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-blue-600 transition text-gray-700 relative">
                <ShoppingBag size={22} />
              </Link>
            </li>
          </ul>
        )}
        
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-gray-200">
                <div className="w-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center">
                  <User size={24} className="mt-2 ml-2" />
                </div>
              </div>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li className="px-4 py-2 font-semibold text-gray-700 border-b mb-2">{currentUser.name}</li>
                {currentUser.role === 'admin' ? (
                  <>
                    <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
                    <li><Link to="/admin/products/add">Tambah Produk</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/profile">Profil Saya</Link></li>
                    <li><Link to="/my-orders">Riwayat Pesanan</Link></li>
                  </>
                )}
                <li className="border-t mt-2 pt-2"><button onClick={handleLogout} className="text-red-500 font-medium">Logout</button></li>
              </ul>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-950 px-5 py-2 text-white rounded-full hover:bg-blue-800 transition font-medium shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
