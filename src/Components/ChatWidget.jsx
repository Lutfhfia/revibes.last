import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, LoaderCircle, MessageCircle, Send, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [admin, setAdmin] = useState(null);
  const [adminError, setAdminError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { currentUser } = useAuth();
  const { chats, sendMessage } = useDatabase();
  const messagesEndRef = useRef(null);

  const userEmail = currentUser ? currentUser.email : 'guest';

  useEffect(() => {
    if (!currentUser || currentUser.role === 'admin') return undefined;

    const controller = new AbortController();
    const fetchAdmin = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin', {
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Admin belum tersedia.');
        }
        setAdmin(data);
        setAdminError('');
      } catch (error) {
        if (!controller.signal.aborted) {
          setAdmin(null);
          setAdminError(error.message || 'Gagal menghubungkan ke admin.');
        }
      }
    };

    fetchAdmin();
    return () => controller.abort();
  }, [currentUser]);

  // Filter messages involving this user
  const myChats = chats.filter(
    (chat) =>
      (chat.senderEmail === userEmail && chat.receiverEmail === admin?.email) ||
      (chat.receiverEmail === userEmail && chat.senderEmail === admin?.email)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [myChats.length, isOpen]);

  // Don't show widget for admin, they have a dedicated page
  if (currentUser?.role === 'admin') return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    if (!currentUser) {
      return;
    }

    if (!admin?.email) {
      setAdminError('Admin belum tersedia. Pastikan backend lokal aktif.');
      return;
    }

    try {
      setIsSending(true);
      await sendMessage(currentUser.email, admin.email, message.trim());
      setMessage('');
      setAdminError('');
    } catch (error) {
      setAdminError(error.message || 'Gagal mengirim pesan.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-950 text-white p-4 rounded-full shadow-xl hover:bg-blue-800 transition transform hover:scale-105"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden h-[500px] max-h-[80vh]">
          {/* Header */}
          <div className="bg-blue-950 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <h3 className="font-semibold">Chat dengan Admin</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition">
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4 flex flex-col">
            <div className="text-center text-xs text-gray-400 my-2">Mulai percakapan</div>
            
            {myChats.map((chat) => {
              const isMine = chat.senderEmail === userEmail;
              return (
                <div key={chat.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    isMine ? 'bg-blue-950 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}>
                    {chat.text}
                  </div>
                </div>
              );
            })}
            
            {!currentUser && (
              <div className="bg-orange-50 text-orange-600 text-xs p-3 rounded-lg text-center mt-auto">
                Silakan login untuk mulai mengirim pesan.
              </div>
            )}
            {currentUser && !admin && (
              <div role="alert" className="bg-orange-50 text-orange-700 text-xs p-3 rounded-lg text-center">
                {adminError || 'Menghubungkan ke admin...'}
              </div>
            )}
            {adminError && admin && (
              <div role="alert" className="flex items-center gap-2 bg-red-50 text-red-600 text-xs p-3 rounded-lg">
                <AlertCircle size={16} aria-hidden="true" />
                {adminError}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={!currentUser || !admin || isSending}
              />
              <button
                type="submit"
                disabled={!currentUser || !admin || !message.trim() || isSending}
                className="bg-blue-950 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-800 transition disabled:opacity-50"
              >
                {isSending ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <Send size={18} className="ml-[-2px]" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
