-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 08, 2026 at 01:34 AM
-- Server version: 8.0.30
-- PHP Version: 8.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_revibes`
--

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `id` int NOT NULL,
  `sender_email` varchar(255) NOT NULL,
  `receiver_email` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `chats`
--

INSERT INTO `chats` (`id`, `sender_email`, `receiver_email`, `text`, `timestamp`) VALUES
(2, 'sazamexico@gmail.com', 'admin@alvi.com', 'halo', '2026-11-05 14:49:56'),
(3, 'admin@alvi.com', 'sazamexico@gmail.com', 'iya kak ada yang bisa saya bantu?', '2026-11-05 14:50:18');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` varchar(50) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_address` text NOT NULL,
  `notes` text,
  `total` int NOT NULL,
  `status` enum('Menunggu Pembayaran','Dibayar','Diproses','Dikirim','Selesai','Dibatalkan') DEFAULT 'Menunggu Pembayaran',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_name`, `customer_email`, `customer_address`, `notes`, `total`, `status`, `created_at`) VALUES
('ORD-1784448080610', 'Luthfi Andini', 'luthfiandini1909@gmail.com', 'griya revari indah', 'sesuai alamat', 350000, 'Selesai', '2026-07-19 08:01:20'),
('ORD-1788933827485', 'Tata Anindita', '062330801581@student.polsri.ac.id', 'blok c6 no 12', 'titipkan dengan orang rumah', 2000000, 'Diproses', '2026-09-09 06:03:47'),
('ORD-1788936464619', 'Tata Anindita', '062330801581@student.polsri.ac.id', 'alang alang lebar', 'minta tolong di kemas dengan rapih', 339000, 'Dibayar', '2026-09-09 06:47:44'),
('ORD-1789184727975', 'Administrator', 'admin@alvi.com', ',,', '', 300000, 'Dibayar', '2026-09-12 03:45:27'),
('ORD-1789185166452', 'hanifa', 'hanifadayratulangi@gmail.com', 'griya revari', 'titip', 450000, 'Diproses', '2026-09-12 03:52:46'),
('ORD-1793887735350', 'andin', 'sazamexico@gmail.com', 'griya revari indah blok c6 no 12', 'sesuai alamat', 300000, 'Dibayar', '2026-11-05 14:08:55');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` varchar(50) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `quantity` int DEFAULT '1',
  `size` varchar(20) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_name`, `price`, `quantity`, `size`, `color`, `image`) VALUES
(1, 'ORD-1784448080610', 'Croptop Spider Painting', 350000, 1, 'L', 'Hitam', '/crop.png'),
(2, 'ORD-1788933827485', 'rio', 2000000, 1, 'M', 'Hitam', 'http://localhost:5000/uploads/products/1783828192721-0-download--1-.jpeg'),
(3, 'ORD-1788936464619', 'Uniqlo Hodie Basic Navy', 339000, 1, 'M', 'Hitam', '/7.png'),
(4, 'ORD-1789184727975', 'Nike Rework Grey', 300000, 1, 'M', 'Hitam', 'http://localhost:5000/uploads/products/1788931387640-0-id-11134207-7qul0-lhhyybkiouqx41.jpeg'),
(5, 'ORD-1789185166452', 'Black white', 450000, 1, 'L', 'Hitam', 'http://localhost:5000/uploads/products/1784448602234-0-1--pengenalan-produk---2-.png'),
(6, 'ORD-1793887735350', 'Nike Rework Grey', 300000, 1, 'L', 'Putih', 'http://localhost:5000/uploads/products/1788931387640-0-id-11134207-7qul0-lhhyybkiouqx41.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `token_hash` char(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `category` varchar(100) NOT NULL,
  `image` varchar(255) NOT NULL,
  `images` text,
  `sizes` text,
  `colors` text,
  `materials` text,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `category`, `image`, `images`, `sizes`, `colors`, `materials`, `description`, `created_at`) VALUES
(1, 'Adidas Rework', 299000, 'Hoodie', '/9.png', NULL, NULL, NULL, NULL, NULL, '2026-06-04 08:32:35'),
(2, 'Denim Work Shirt', 319000, 'Shirt', '/11.png', NULL, NULL, NULL, NULL, NULL, '2026-06-04 08:32:35'),
(3, 'Puma Hoodie', 289000, 'Hoodie', '/5.png', NULL, NULL, NULL, NULL, NULL, '2026-06-04 08:32:35'),
(4, 'Uniqlo Hodie Basic Navy', 339000, 'Hoodie', '/7.png', NULL, NULL, NULL, NULL, NULL, '2026-06-04 08:32:35'),
(5, 'Nike Hodie Black', 339000, 'Hoodie', '/13.png', NULL, NULL, NULL, NULL, NULL, '2026-06-04 08:32:35'),
(6, 'Rework Painting', 300000, 'Jacket', '/2(1).png', NULL, NULL, NULL, NULL, NULL, '2026-06-04 08:32:35'),
(7, 'Croptop Spider Painting', 350000, 'Croptop', '/crop.png', NULL, NULL, NULL, NULL, NULL, '2026-06-04 08:32:35'),
(8, 'Nike Rework Grey', 300000, 'Hoodie', 'http://localhost:5000/uploads/products/1788931387640-0-id-11134207-7qul0-lhhyybkiouqx41.jpeg', '[\"http://localhost:5000/uploads/products/1788931387640-0-id-11134207-7qul0-lhhyybkiouqx41.jpeg\"]', NULL, NULL, NULL, NULL, '2026-07-12 03:19:53'),
(10, 'rio', 2000000, 'Hoodie', 'http://localhost:5000/uploads/products/1783828192721-0-download--1-.jpeg', '[\"http://localhost:5000/uploads/products/1783828192721-0-download--1-.jpeg\"]', '[\"M\",\"L\",\"XL\"]', '[\"Hitam\",\"Putih\"]', '[\"Cotton\"]', 'okeee', '2026-07-12 03:49:52'),
(11, 'Black white', 450000, 'Hoodie', 'http://localhost:5000/uploads/products/1784448602234-0-1--pengenalan-produk---2-.png', '[\"http://localhost:5000/uploads/products/1784448602234-0-1--pengenalan-produk---2-.png\",\"http://localhost:5000/uploads/products/1784448602248-1-logo-simbol-diktisaintek-berdampak.png\"]', '[\"M\",\"L\",\"XL\"]', '[\"Hitam\",\"Putih\"]', '[\"Cotton\"]', 'oke', '2026-07-19 08:10:02');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `role`, `created_at`) VALUES
(1, 'Administrator', 'admin@alvi.com', 'admin', NULL, NULL, 'admin', '2026-06-04 07:45:37'),
(2, 'Luthfi Andini', 'luthfiandini1909@gmail.com', 'Palembang2005', NULL, NULL, 'user', '2026-07-19 08:00:52'),
(3, 'Tata Anindita', '062330801581@student.polsri.ac.id', 'password', NULL, NULL, 'user', '2026-09-09 05:52:29'),
(4, 'hanifa', 'hanifadayratulangi@gmail.com', 'password', NULL, NULL, 'user', '2026-09-12 03:46:58'),
(5, 'andin', 'sazamexico@gmail.com', 'password', NULL, NULL, 'user', '2026-11-05 14:06:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `token_hash` (`token_hash`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
