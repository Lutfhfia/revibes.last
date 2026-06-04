import React from 'react'
import { Routes, Route } from "react-router-dom";
import Navbar from '../Components/Navbar';
import ShopPage from './ShopPage';
import Footer from '../Components/Footer';


function AllShop() {
  return (
    <div>
        <Navbar/>
        <ShopPage/>
        <Footer/>
    </div>
  )
}

export default AllShop