import React, { createContext, useState, useContext, useEffect } from "react";

const DatabaseContext = createContext();

export function useDatabase() {
  return useContext(DatabaseContext);
}

export function DatabaseProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [chats, setChats] = useState([]);

  // DIBENERIN: Pakai URL relatif di Vercel, tetap localhost saat di laptop sendiri
  const API_URL =
    process.env.NODE_ENV === "production"
      ? "/api"
      : "http://localhost:5000/api";

  const fetchData = async () => {
    try {
      const [prodRes, ordRes, chatRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/orders`),
        fetch(`${API_URL}/chats`),
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
      if (chatRes.ok) setChats(await chatRes.json());
    } catch (e) {
      console.error("Failed to fetch from API:", e);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto refresh data setiap 5 detik
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // CREATE PRODUCT
  // =========================
  const addProduct = async (productData) => {
    let res;

    try {
      res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
    } catch {
      throw new Error(
        "Backend belum aktif. Jalankan dulu: node backend/server.js",
      );
    }

    if (!res.ok) {
      if (res.status === 413) {
        throw new Error(
          "Ukuran gambar terlalu besar. Gunakan gambar maksimal 5 MB.",
        );
      }

      const errorData = await res.json().catch(() => ({}));

      throw new Error(errorData.error || "Gagal menyimpan produk.");
    }

    await fetchData();
  };

  // =========================
  // UPDATE PRODUCT
  // =========================
  const updateProduct = async (id, productData) => {
    let res;

    try {
      res = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
    } catch {
      throw new Error(
        "Backend belum aktif. Jalankan dulu: node backend/server.js",
      );
    }

    if (!res.ok) {
      if (res.status === 413) {
        throw new Error(
          "Ukuran gambar terlalu besar. Gunakan gambar maksimal 5 MB.",
        );
      }

      const errorData = await res.json().catch(() => ({}));

      throw new Error(errorData.error || "Gagal mengubah produk.");
    }

    await fetchData();
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct = async (id) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // =========================
  // CREATE ORDER
  // =========================
  const addOrder = async (orderData) => {
    const orderId = `ORD-${Date.now()}`;

    const payload = {
      ...orderData,
      id: orderId,
    };

    await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Update lokal agar UI langsung berubah
    const newOrder = {
      ...payload,
      date: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    return orderId;
  };

  // =========================
  // UPDATE ORDER STATUS
  // =========================
  const updateOrderStatus = async (orderId, status) => {
    await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    });

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
            }
          : o,
      ),
    );
  };

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = async (senderEmail, receiverEmail, text) => {
    const response = await fetch(`${API_URL}/chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderEmail,
        receiverEmail,
        text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Gagal mengirim pesan.");
    }

    setChats((prev) => [...prev, data]);

    return data;
  };

  // =========================
  // GET CHATS BETWEEN TWO USERS
  // =========================
  const getChatBetween = (email1, email2) => {
    return chats.filter(
      (chat) =>
        (chat.senderEmail === email1 && chat.receiverEmail === email2) ||
        (chat.senderEmail === email2 && chat.receiverEmail === email1),
    );
  };

  // =========================
  // GET ALL USERS THAT CHATTED WITH ADMIN
  // =========================
  const getChatUsersForAdmin = (adminEmail) => {
    const userEmails = new Set();
    chats.forEach((chat) => {
      if (chat.receiverEmail === adminEmail) {
        userEmails.add(chat.senderEmail);
      } else if (chat.senderEmail === adminEmail) {
        userEmails.add(chat.receiverEmail);
      }
    });
    return Array.from(userEmails);
  };

  // =========================
  // VALUE
  // =========================
  const value = {
    products,
    orders,
    chats,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    updateOrderStatus,
    sendMessage,
    getChatBetween,
    getChatUsersForAdmin,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}
