import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { currentUser } = useAuth();
  const { chats, sendMessage } = useDatabase();

  // Don't show widget for admin, they have a dedicated page
  if (currentUser?.role === 'admin') return null;

  const userEmail = currentUser ? currentUser.email : 'guest';

  // Filter messages involving this user
  const myChats = chats.filter(
    (c) => c.senderEmail === userEmail || c.receiverRole === userEmail
  );

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!currentUser) {
      alert("Anda harus login untuk mengirim pesan.");
      return;
    }

    sendMessage(currentUser.email, 'admin', message);
    setMessage('');
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
              <X size={20} />
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
                disabled={!currentUser}
              />
              <button
                type="submit"
                disabled={!currentUser || !message.trim()}
                className="bg-blue-950 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-800 transition disabled:opacity-50"
              >
                <Send size={18} className="ml-[-2px]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
