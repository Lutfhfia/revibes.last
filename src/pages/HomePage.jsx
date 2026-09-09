import React from "react";
import HeroSection from "../Components/Hero-Section";
import Pack from "../Components/Pack";
import ShopPage from "./ShopPage";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ShopPage />
      <Pack />
    </div>
  );
}
