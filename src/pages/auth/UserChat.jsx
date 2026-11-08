import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDatabase } from "../../context/DatabaseContext";
import { Send, User, MessageCircle, Clock } from "lucide-react";

export default function UserChat() {
  const { currentUser } = useAuth();
  const { sendMessage, getChatBetween } = useDatabase();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [adminEmail, setAdminEmail] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  const messagesEndRef = useRef(null);

  // ==========================================
  // CEK LOGIN PEMBELI
  // ==========================================
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // ==========================================
  // AMBIL AKUN ADMIN
  // ==========================================
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setLoadingAdmin(true);

        const response = await fetch("http://localhost:5000/api/admin");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Admin tidak ditemukan.");
        }

        setAdminEmail(data.email);
        setAdminName(data.name || "Admin");
      } catch (error) {
        console.error("Gagal mengambil admin:", error);
        setAdminEmail(null);
      } finally {
        setLoadingAdmin(false);
      }
    };

    if (currentUser) {
      fetchAdmin();
    }
  }, [currentUser]);

  // ==========================================
  // CHAT PEMBELI DENGAN ADMIN (GUNAKAN HELPER)
  // ==========================================
  const userChats = adminEmail
    ? getChatBetween(currentUser?.email, adminEmail)
    : [];

  // ==========================================
  // AUTO SCROLL KE PESAN TERAKHIR
  // ==========================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [userChats.length]);

  // ==========================================
  // KIRIM PESAN
  // ==========================================
  const handleSend = async (e) => {
    e.preventDefault();

    if (!message.trim() || !currentUser || !adminEmail || sending) {
      return;
    }

    try {
      setSending(true);

      await sendMessage(currentUser.email, adminEmail, message.trim());

      setMessage("");
    } catch (error) {
      alert(error.message || "Gagal mengirim pesan.");
    } finally {
      setSending(false);
    }
  };

  // ==========================================
  // FORMAT WAKTU (IMPROVED)
  // ==========================================
  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 h-[80vh] flex flex-col">
      {/* TITLE & DESCRIPTION */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-950">Chat dengan Admin</h1>

        <p className="text-gray-500 text-sm mt-1">
          Hubungi admin jika ingin bertanya mengenai produk atau pesanan Anda
        </p>
      </div>

      {/* CHAT CONTAINER */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-900">
              <User size={20} />
            </div>

            <div>
              <h3 className="font-bold text-gray-800">{adminName}</h3>

              <p className="text-xs text-gray-400">
                {loadingAdmin
                  ? "Memuat..."
                  : !adminEmail
                    ? "Tidak tersedia"
                    : "Layanan pelanggan"}
              </p>
            </div>
          </div>

          {adminEmail && !loadingAdmin && (
            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Siap membantu
            </div>
          )}
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4">
          {loadingAdmin ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <Clock size={16} className="animate-spin" />
                Menghubungkan ke admin...
              </div>
            </div>
          ) : !adminEmail ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <MessageCircle size={60} className="mb-4 opacity-20" />

              <p className="text-sm font-medium">Admin belum tersedia</p>

              <p className="text-xs mt-1">Silakan coba beberapa saat lagi.</p>
            </div>
          ) : userChats.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <MessageCircle size={60} className="mb-4 opacity-20" />

              <p className="text-sm font-medium">Belum ada pesan</p>

              <p className="text-xs mt-1">
                Mulai percakapan dengan admin di bawah.
              </p>
            </div>
          ) : (
            userChats.map((chat) => {
              const isUser = chat.senderEmail === currentUser.email;

              return (
                <div
                  key={chat.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm text-sm ${
                      isUser
                        ? "bg-blue-950 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                    }`}
                  >
                    <p className="break-words">{chat.text}</p>

                    <p
                      className={`text-[10px] mt-1 ${
                        isUser ? "text-blue-200" : "text-gray-400"
                      }`}
                    >
                      {formatTime(chat.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                loadingAdmin
                  ? "Menghubungkan..."
                  : !adminEmail
                    ? "Admin tidak tersedia"
                    : "Tulis pesan..."
              }
              disabled={sending || loadingAdmin || !adminEmail}
              className="flex-1 bg-gray-100 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
            />

            <button
              type="submit"
              disabled={
                !message.trim() || sending || loadingAdmin || !adminEmail
              }
              className="bg-blue-950 text-white px-6 rounded-full flex items-center justify-center hover:bg-blue-800 transition disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>

          {!loadingAdmin && !adminEmail && (
            <p className="text-xs text-red-500 mt-2">
              ⚠️ Admin belum tersedia untuk percakapan.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
