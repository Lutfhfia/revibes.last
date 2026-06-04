import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import HomePage from "./pages/HomePage";
import KontakSection from "./Components/Kontak-Section";
import AboutPages from "./pages/AboutPages";
import AllShop from "./pages/AllShop";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kontak" element={<KontakSection />} />
        <Route path="/about" element={<AboutPages />} />
        <Route path="/shop" element={<AllShop />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
