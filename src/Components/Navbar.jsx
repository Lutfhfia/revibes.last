import { CodeXml, MessageCircle, ShoppingBag } from "lucide-react";
import React from "react";

function Navbar() {
  return (
    <header className="sticky top-0 border border-gray-500 bg-white/80">
      {/*div pembungkus*/}
      <div className="flex max-w-7xl mx-auto justify-between h-16 items-center px-4 ">
        {/*div logo*/}
        <div className="flex items-center gap-2 ">
          <img className="size-12 gap-4 " src="/logo.png" />
          <h1 className="font-bold text-xl text-blue-950">ALVI.THRIFT.SHOP.</h1>
        </div>
        <label className="input">
          <svg
            className="h-[1em] opacity-50"
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
          <input type="search" className="grow" placeholder="Search" />
        </label>
        <ul className="hidden md:flex gap-8">
          <li>
            <a href="/" className="hover:text-blue-950">
              Home
            </a>
          </li>
          <li>
            <a href="/shop" className="hover:text-blue-950">
              Shop
            </a>
          </li>
          <li>
            <a href="/about" className="hover:text-blue-950">
              About
            </a>
          </li>
          <li>
            <a href="/kontak" className="hover:text-blue-950">
              Contact
            </a>
          </li>
          <li>
            <a href="/cart" className="hover:text-blue-950">
              <ShoppingBag />
            </a>
          </li>
          <li>
            <a href="/pesan" className="hover:text-blue-950">
              <MessageCircle />
            </a>
          </li>
        </ul>
        <a
          href=""
          className="bg-blue-950 px-4 py-2 text-white rounded-md hover:bg-blue-950"
        >
          Login
        </a>
      </div>
    </header>
  );
}

export default Navbar;
