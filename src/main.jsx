  import { StrictMode } from "react";
  import { createRoot } from "react-dom/client";
  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import "./index.css";

  // Providers
  import { AuthProvider } from "./context/AuthContext";
  import { DatabaseProvider } from "./context/DatabaseContext";

  // Layout
  import AppLayout from "./AppLayout";

  // Pages
  import HomePage from "./pages/HomePage";
  import KontakSection from "./Components/Kontak-Section";
  import AboutSection from "./Components/About-Section";
  import ShopPage from "./pages/ShopPage";
  import CartPage from "./pages/CartPage";
  import CheckoutPage from "./pages/CheckoutPage";

  // Auth Pages
  import LoginPage from "./pages/auth/LoginPage";
  import RegisterPage from "./pages/auth/RegisterPage";
  import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
  import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
  import ProfilePage from "./pages/auth/ProfilePage";
  import MyOrdersPage from "./pages/auth/MyOrdersPage";
  import UserChat from "./pages/auth/UserChat";

  // Additional Pages
  import PaymentPage from "./pages/PaymentPage";

  // Admin Pages
  import AdminDashboard from "./pages/admin/AdminDashboard";
  import AdminProducts from "./pages/admin/AdminProducts";
  import AdminAddProduct from "./pages/admin/AdminAddProduct";
  import AdminOrders from "./pages/admin/AdminOrders";
  import AdminChat from "./pages/admin/AdminChat";

  /* User Routes */
  
  <Route path="chat" element={<UserChat />} />;

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <AuthProvider>
        <DatabaseProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="kontak" element={<KontakSection />} />
                <Route path="about" element={<AboutSection />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="payment/:id" element={<PaymentPage />} />

                {/* Auth Routes */}
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route
                  path="forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route
                  path="reset-password"
                  element={<ResetPasswordPage />}
                />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="my-orders" element={<MyOrdersPage />} />
                <Route path="chat" element={<UserChat />} />

                {/* Admin Routes */}
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route path="admin/products" element={<AdminProducts />} />
                <Route
                  path="admin/products/add"
                  element={<AdminAddProduct />}
                />
                <Route path="admin/orders" element={<AdminOrders />} />
                <Route path="admin/chat" element={<AdminChat />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DatabaseProvider>
      </AuthProvider>
    </StrictMode>,
  );
