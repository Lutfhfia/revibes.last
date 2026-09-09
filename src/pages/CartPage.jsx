import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDatabase } from "../context/DatabaseContext";
import { ShoppingBag, X } from "lucide-react";

function CartPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addOrder } = useDatabase();

  const [cart, setCart] = useState(() => {
    const savedCart = sessionStorage.getItem("thriftShopCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [customerInfo, setCustomerInfo] = useState({
    name: currentUser?.name || "",
    address: currentUser?.address || "",
    notes: "",
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("thriftShopCart", JSON.stringify(cart));
  }, [cart]);

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

  function clearCart() {
    if (window.confirm("Apakah Anda yakin ingin mengosongkan keranjang?")) {
      setCart([]);
      sessionStorage.removeItem("thriftShopCart");
    }
  }

  function calculateTotal() {
    return cart.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  }

  function getTotalItems() {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  }

  const handleOpenModal = () => {
    if (!currentUser) {
      alert("Anda harus login terlebih dahulu untuk melakukan pesanan.");
      navigate("/login");
      return;
    }
    setIsModalOpen(true);
  };

  async function handleCheckout(e) {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.address) {
      alert("Mohon isi Nama dan Alamat Pengiriman terlebih dahulu.");
      return;
    }

    const orderData = {
      customerName: customerInfo.name,
      customerEmail: currentUser.email,
      customerAddress: customerInfo.address,
      notes: customerInfo.notes,
      items: cart,
      total: calculateTotal(),
      status: "Menunggu Pembayaran"
    };

    const orderId = await addOrder(orderData);
    
    setCart([]);
    sessionStorage.removeItem("thriftShopCart");
    setIsModalOpen(false);
    
    navigate(`/payment/${orderId}`);
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 relative">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-950 flex items-center gap-2">
            <ShoppingBag size={32} />
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
              <ShoppingBag className="text-gray-400" size={48} />
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
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
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
                        <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 leading-tight">{item.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Ukuran: <span className="font-medium text-gray-700">{item.size}</span> | 
                              Warna: <span className="font-medium text-gray-700">{item.color}</span>
                            </p>
                          </div>
                          
                          <div className="flex items-end justify-between mt-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                <button onClick={() => updateQuantity(item.id, quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 transition disabled:opacity-50" disabled={quantity <= 1}>−</button>
                                <span className="w-8 text-center text-sm font-semibold text-gray-800">{quantity}</span>
                                <button onClick={() => updateQuantity(item.id, quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 transition disabled:opacity-50" disabled={quantity >= 10}>+</button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 line-through">Rp{(item.price + 20000).toLocaleString("id-ID")}</p>
                              <p className="font-bold text-blue-950 text-lg">Rp{itemTotal.toLocaleString("id-ID")}</p>
                            </div>
                          </div>
                        </div>
                        
                        <button onClick={() => removeFromCart(item.id)} className="absolute top-2 right-0 p-2 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                          <X size={20} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side: Summary Only */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 border border-gray-100">
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
                    <span className="text-green-600 italic text-sm font-medium">Gratis Ongkir</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center mt-2">
                    <span className="font-semibold text-gray-800">Total Pembayaran</span>
                    <span className="font-bold text-xl text-blue-950">Rp{calculateTotal().toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <button
                  onClick={handleOpenModal}
                  className="w-full py-4 bg-blue-950 text-white font-bold rounded-xl hover:bg-blue-800 transition shadow-lg hover:shadow-xl mt-4"
                >
                  Checkout Sekarang
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Modal Checkout Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-950 px-6 py-4 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold">Lengkapi Data Pengiriman</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-blue-200 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCheckout} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                <textarea 
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  required
                  placeholder="Kecamatan, Kota, Kode Pos"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (Opsional)</label>
                <input 
                  type="text" 
                  name="notes"
                  value={customerInfo.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Pesan untuk kurir/penjual"
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center mt-4">
                <span className="font-semibold text-blue-900">Total Bayar:</span>
                <span className="font-bold text-xl text-blue-950">Rp{calculateTotal().toLocaleString("id-ID")}</span>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">
                  Kembali
                </button>
                <button type="submit" className="flex-1 py-3 bg-blue-950 text-white font-bold rounded-xl hover:bg-blue-800 transition shadow-md">
                  Lanjut Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
