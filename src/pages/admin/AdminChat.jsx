import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDatabase } from "../../context/DatabaseContext";
import { Send, User, MessageCircle, ChevronDown } from "lucide-react";

export default function AdminChat() {
  const { currentUser } = useAuth();
  const { chats, sendMessage, getChatBetween } = useDatabase();
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // ==========================================
  // CEK LOGIN ADMIN
  // ==========================================
  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // ==========================================
  // AUTO SCROLL KE PESAN TERBARU
  // ==========================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedUser, chats]);

  // ==========================================
  // DAFTAR SEMUA USER YANG CHAT DENGAN ADMIN
  // ==========================================
  const userEmails = [
    ...new Set(
      chats
        .filter(
          (chat) =>
            (chat.receiverEmail === currentUser?.email &&
              chat.senderEmail !== currentUser?.email) ||
            (chat.senderEmail === currentUser?.email &&
              chat.receiverEmail !== currentUser?.email),
        )
        .map((chat) =>
          chat.senderEmail === currentUser?.email
            ? chat.receiverEmail
            : chat.senderEmail,
        ),
    ),
  ].sort((a, b) => {
    // Sort by latest message
    const lastChatA = chats
      .filter(
        (chat) =>
          (chat.senderEmail === a &&
            chat.receiverEmail === currentUser?.email) ||
          (chat.senderEmail === currentUser?.email && chat.receiverEmail === a),
      )
      .pop();

    const lastChatB = chats
      .filter(
        (chat) =>
          (chat.senderEmail === b &&
            chat.receiverEmail === currentUser?.email) ||
          (chat.senderEmail === currentUser?.email && chat.receiverEmail === b),
      )
      .pop();

    return (
      new Date(lastChatB?.timestamp || 0) - new Date(lastChatA?.timestamp || 0)
    );
  });

  // ==========================================
  // CHAT DENGAN PEMBELI YANG DIPILIH
  // ==========================================
  const activeChats = selectedUser
    ? getChatBetween(currentUser?.email, selectedUser)
    : [];

  // ==========================================
  // HITUNG PESAN BELUM DIBACA DARI USER
  // ==========================================
  const getUnreadCount = (userEmail) => {
    return chats.filter(
      (chat) =>
        chat.senderEmail === userEmail &&
        chat.receiverEmail === currentUser?.email,
    ).length;
  };

  // ==========================================
  // KIRIM BALASAN
  // ==========================================
  const handleSend = async (e) => {
    e.preventDefault();

    if (!replyMessage.trim() || !selectedUser || sending) {
      return;
    }

    try {
      setSending(true);

      await sendMessage(currentUser.email, selectedUser, replyMessage);

      setReplyMessage("");
    } catch (error) {
      alert(error.message || "Gagal mengirim pesan.");
    } finally {
      setSending(false);
    }
  };

  // ==========================================
  // FORMAT WAKTU
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[80vh] flex flex-col">
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-blue-950 mb-6">Pesan Masuk</h1>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex">
        {/* =====================================
            SIDEBAR PEMBELI
        ====================================== */}
        <div className="w-1/3 border-r border-gray-100 bg-gray-50 overflow-y-auto">
          <div className="p-4 font-semibold text-gray-700 border-b border-gray-200 sticky top-0 bg-gray-50">
            <div className="flex items-center justify-between">
              <span>Daftar Pelanggan ({userEmails.length})</span>
            </div>
          </div>

          {userEmails.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              <MessageCircle size={32} className="mx-auto mb-2 opacity-20" />
              <p>Belum ada pesan masuk.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {userEmails.map((email) => {
                const lastChat = chats
                  .filter(
                    (chat) =>
                      (chat.senderEmail === email &&
                        chat.receiverEmail === currentUser?.email) ||
                      (chat.senderEmail === currentUser?.email &&
                        chat.receiverEmail === email),
                  )
                  .pop();

                const unreadCount = getUnreadCount(email);

                return (
                  <button
                    key={email}
                    onClick={() => setSelectedUser(email)}
                    className={`
                      w-full text-left p-4
                      hover:bg-white transition
                      flex items-center gap-3
                      ${selectedUser === email ? "bg-white border-l-4 border-l-blue-950" : ""}
                    `}
                  >
                    <div
                      className="
                      relative
                      w-10 h-10
                      bg-blue-100
                      rounded-full
                      flex items-center
                      justify-center
                      text-blue-900
                      flex-shrink-0
                    "
                    >
                      <User size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>

                    <div className="truncate flex-1">
                      <p className="font-medium text-gray-800 truncate">
                        {email}
                      </p>

                      <p className="text-xs text-gray-500 truncate">
                        {lastChat?.text || "Mulai percakapan"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* =====================================
            AREA CHAT
        ====================================== */}
        <div className="w-2/3 flex flex-col bg-white">
          {selectedUser ? (
            <>
              {/* HEADER */}
              <div
                className="
                p-4
                border-b border-gray-100
                flex items-center justify-between
                bg-gradient-to-r from-blue-50 to-white
              "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                    w-10 h-10
                    bg-blue-100
                    rounded-full
                    flex items-center
                    justify-center
                    text-blue-900
                  "
                  >
                    <User size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800">{selectedUser}</h3>

                    <p className="text-xs text-gray-400">Pelanggan</p>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  {activeChats.length} pesan
                </div>
              </div>

              {/* MESSAGES */}
              <div
                className="
                flex-1
                p-6
                overflow-y-auto
                bg-slate-50
                space-y-4
              "
              >
                {activeChats.length === 0 ? (
                  <div
                    className="
                    h-full
                    flex
                    items-center
                    justify-center
                    text-gray-400
                    text-sm
                  "
                  >
                    Belum ada percakapan. Tunggu pelanggan mengirim pesan.
                  </div>
                ) : (
                  activeChats.map((chat) => {
                    const isAdmin = chat.senderEmail === currentUser?.email;

                    return (
                      <div
                        key={chat.id}
                        className={`
                          flex
                          ${isAdmin ? "justify-end" : "justify-start"}
                        `}
                      >
                        <div
                          className={`
                            max-w-[70%]
                            rounded-2xl
                            px-5
                            py-3
                            shadow-sm
                            text-sm

                            ${
                              isAdmin
                                ? `
                                  bg-blue-950
                                  text-white
                                  rounded-br-none
                                `
                                : `
                                  bg-white
                                  text-gray-800
                                  border
                                  border-gray-100
                                  rounded-bl-none
                                `
                            }
                          `}
                        >
                          <p className="break-words">{chat.text}</p>

                          <p
                            className={`
                              text-[10px]
                              mt-1
                              ${isAdmin ? "text-blue-200" : "text-gray-400"}
                            `}
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
              <div
                className="
                p-4
                border-t border-gray-100
                bg-white
              "
              >
                <form onSubmit={handleSend} className="flex gap-3">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Balas pesan..."
                    disabled={sending}
                    className="
                      flex-1
                      bg-gray-100
                      rounded-full
                      px-5
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                      disabled:opacity-50
                      text-sm
                    "
                  />

                  <button
                    type="submit"
                    disabled={!replyMessage.trim() || sending}
                    className="
                      bg-blue-950
                      text-white
                      px-6
                      rounded-full
                      flex items-center
                      justify-center
                      hover:bg-blue-800
                      transition
                      disabled:opacity-50
                    "
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div
              className="
              flex-1
              flex
              flex-col
              items-center
              justify-center
              text-gray-400
            "
            >
              <MessageCircle size={64} className="mb-4 opacity-20" />

              <p>Pilih pelanggan untuk melihat dan membalas pesan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
