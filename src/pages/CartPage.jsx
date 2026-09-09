import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const navigate = useNavigate();

  // Load cart from sessionStorage
  const [cart, setCart] = useState(() => {
    const savedCart = sessionStorage.getItem("thriftShopCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Form state
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
    notes: "",
  });

  // Update cart in sessionStorage when cart changes
  useEffect(() => {
    sessionStorage.setItem("thriftShopCart", JSON.stringify(cart));
  }, [cart]);

  // Update quantity of item in cart
  function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) return;
    if (newQuantity > 10) return;

    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  }
  
  function removeFromCart(itemId) {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    setCart(updatedCart);
  }

  // Clear entire cart
  function clearCart() {
    if (window.confirm("Apakah Anda yakin ingin mengosongkan keranjang?")) {
      setCart([]);
      sessionStorage.removeItem("thriftShopCart");
    }
  }

  // Calculate total price
  function calculateTotal() {
    return cart.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  }

  // Calculate total items
  function getTotalItems() {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckout(e) {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.address) {
      alert("Mohon isi Nama dan Alamat Pengiriman terlebih dahulu.");
      return;
    }

    let message = `*Halo, saya ingin memesan dari Alvi Thrift Store:*\n\n`;
    message += `*Data Pemesan:*\n`;
    message += `- Nama: ${customerInfo.name}\n`;
    message += `- Alamat: ${customerInfo.address}\n`;
    if (customerInfo.notes) {
      message += `- Catatan: ${customerInfo.notes}\n`;
    }
    message += `\n*Detail Pesanan:*\n`;
    
    cart.forEach((item, idx) => {
      const quantity = item.quantity || 1;
      const itemTotal = item.price * quantity;
      message += `${idx + 1}. *${item.name}*\n`;
      message += `   Ukuran: ${item.size} | Warna: ${item.color}\n`;
      message += `   Jumlah: ${quantity} x Rp${item.price.toLocaleString("id-ID")}\n`;
      message += `   Subtotal: Rp${itemTotal.toLocaleString("id-ID")}\n\n`;
    });
    
    message += `*Total Keseluruhan (Belum Ongkir): Rp${calculateTotal().toLocaleString("id-ID")}*\n`;
    message += `Total Item: ${getTotalItems()} item\n\n`;
    message += `Mohon info ongkos kirim dan nomor rekeningnya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/6285768111508?text=${encodedMessage}`, "_blank");
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-950 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Keranjang Belanja
          </h1>
          <button
            onClick={() => navigate("/shop")}
            className="text-blue-600 font-medium hover:text-blue-800 transition flex items-center gap-1"
          >
            Lanjut Belanja <span aria-hidden="true">&rarr;</span>
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Keranjang Anda Kosong</h2>
            <p className="text-gray-500 mb-8">Sepertinya Anda belum menambahkan produk apapun ke keranjang.</p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-blue-950 text-white px-8 py-3 rounded-full hover:bg-blue-800 transition font-medium shadow-md"
            >
              Mulai Belanja Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Side: Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Daftar Produk ({getTotalItems()})</h2>
                  <button 
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                  >
                    Kosongkan Keranjang
                  </button>
                </div>
                
                <div className="space-y-6">
                  {cart.map((item) => {
                    const quantity = item.quantity || 1;
                    const itemTotal = item.price * quantity;

                    return (
                      <div key={item.id} className="flex gap-4 py-2 border-b border-gray-50 last:border-0 relative group">
                        <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Ukuran: <span className="font-medium text-gray-700">{item.size}</span> | 
                              Warna: <span className="font-medium text-gray-700">{item.color}</span>
                            </p>
                          </div>
                          
                          <div className="flex items-end justify-between mt-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                <button
                                  onClick={() => updateQuantity(item.id, quantity - 1)}
                                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 transition disabled:opacity-50"
                                  disabled={quantity <= 1}
                                >
                                  −
                                </button>
                                <span className="w-8 text-center text-sm font-semibold text-gray-800">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 transition disabled:opacity-50"
                                  disabled={quantity >= 10}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 line-through">Rp{(item.price + 20000).toLocaleString("id-ID")}</p>
                              <p className="font-bold text-blue-950 text-lg">Rp{itemTotal.toLocaleString("id-ID")}</p>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="absolute top-2 right-0 p-2 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                          title="Hapus dari keranjang"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side: Form & Summary */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-4">
                  Ringkasan Pesanan
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal Produk</span>
                    <span>Rp{calculateTotal().toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ongkos Kirim</span>
                    <span className="text-orange-500 italic text-sm">Dihitung manual via WA</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center mt-2">
                    <span className="font-semibold text-gray-800">Total Sementara</span>
                    <span className="font-bold text-xl text-blue-950">Rp{calculateTotal().toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700">Data Pengiriman</h3>
                  <div>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Nama Lengkap" 
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <textarea 
                      name="address"
                      placeholder="Alamat Lengkap (Kec, Kota, Kode Pos)" 
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <input 
                      type="text" 
                      name="notes"
                      placeholder="Catatan (Opsional)" 
                      value={customerInfo.notes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-lg hover:shadow-xl flex justify-center items-center gap-2 mt-6"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    Pesan via WhatsApp
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-3">
                    Anda akan diarahkan ke WhatsApp untuk menyelesaikan pembayaran.
                  </p>
                </form>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
