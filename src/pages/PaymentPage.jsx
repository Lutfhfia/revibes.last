import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useDatabase();

  const order = orders.find(o => o.id === id);

  useEffect(() => {
    if (!order) {
      navigate('/my-orders');
    }
  }, [order, navigate]);

  if (!order) return null;

  const handleConfirmPayment = () => {
    // Mock changing status to 'Dibayar'
    updateOrderStatus(order.id, 'Dibayar');
    alert("Pembayaran berhasil dikonfirmasi! Admin akan segera memproses pesanan Anda.");
    navigate('/my-orders');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-blue-950 text-white p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Pembayaran QRIS</h1>
          <p className="text-blue-200">ID Pesanan: <span className="font-mono font-medium text-white">{order.id}</span></p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <p className="text-gray-500 mb-1">Total Tagihan</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Rp{order.total.toLocaleString('id-ID')}</h2>
          </div>

          <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-6 flex flex-col items-center justify-center mx-auto max-w-sm mb-8">
            {/* Dummy QRIS Barcode Placeholder */}
            <div className="w-64 h-64 bg-white border border-gray-200 p-2 rounded-xl shadow-sm mb-4 relative flex items-center justify-center">
              {/* This is a placeholder for actual QRIS. We simulate it with a generic pattern. */}
              <div className="w-full h-full border-[10px] border-black flex items-center justify-center p-2 relative">
                <div className="absolute top-0 left-0 w-8 h-8 bg-black m-2"></div>
                <div className="absolute top-0 right-0 w-8 h-8 bg-black m-2"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 bg-black m-2"></div>
                <div className="grid grid-cols-5 grid-rows-5 gap-1 w-24 h-24">
                  {[...Array(25)].map((_, i) => (
                    <div key={i} className={`bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                  ))}
                </div>
                <div className="absolute bottom-2 right-2 font-bold text-xl tracking-tighter">QRIS</div>
              </div>
            </div>
            
            <p className="text-sm text-center text-blue-800 font-medium">
              Scan barcode di atas menggunakan aplikasi m-Banking atau e-Wallet Anda (Gopay, OVO, Dana, LinkAja, BCA Mobile, dll).
            </p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleConfirmPayment}
              className="w-full bg-blue-950 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-800 transition shadow-lg hover:shadow-xl"
            >
              Saya Sudah Bayar
            </button>
            <button 
              onClick={() => navigate('/my-orders')}
              className="w-full bg-gray-100 text-gray-700 font-bold text-lg py-4 rounded-xl hover:bg-gray-200 transition"
            >
              Bayar Nanti
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
