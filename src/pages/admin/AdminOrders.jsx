import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Eye, X, User, MapPin, FileText, ClipboardList, Package, Calendar } from 'lucide-react';

const orderSequence = ['Menunggu Pembayaran', 'Dibayar', 'Diproses', 'Dikirim', 'Selesai'];

const getAllowedStatuses = (currentStatus) => {
  const currentIndex = orderSequence.indexOf(currentStatus);
  if (currentStatus === 'Dibatalkan') {
    return ['Dibatalkan'];
  }
  if (currentIndex === -1) {
    return [currentStatus, ...orderSequence, 'Dibatalkan'];
  }
  
  const allowed = orderSequence.slice(currentIndex);
  
  // Catatan: Pembatalan hanya bisa dilakukan jika status masih Menunggu Pembayaran atau Dibayar
  if (currentStatus === 'Menunggu Pembayaran' || currentStatus === 'Dibayar') {
    allowed.push('Dibatalkan');
  }
  return allowed;
};

export default function AdminOrders() {
  const { currentUser } = useAuth();
  const { orders, updateOrderStatus } = useDatabase();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleStatusChange = (orderId, e) => {
    updateOrderStatus(orderId, e.target.value);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-950 mb-8">Kelola Pesanan</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">ID Pesanan</th>
                <th className="px-6 py-4 font-semibold">Pelanggan</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Tanggal</th>
                <th className="px-6 py-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4">
                    <div>{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-blue-950">Rp{order.total.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e)}
                      disabled={order.status === 'Selesai' || order.status === 'Dibatalkan'}
                      className="border border-gray-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white font-medium disabled:bg-gray-100 disabled:text-gray-500 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {getAllowedStatuses(order.status).map((statusOpt) => (
                        <option key={statusOpt} value={statusOpt}>
                          {statusOpt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {new Date(order.date).toLocaleDateString('id-ID', { year:'numeric', month:'short', day:'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-xs inline-flex items-center gap-1 hover:underline bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                    >
                      <Eye size={14} />
                      Lihat
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">Belum ada pesanan masuk.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Pesanan */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-blue-950 text-white px-6 py-4 flex justify-between items-center flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ClipboardList size={22} />
                  Detail Pesanan
                </h2>
                <p className="text-xs text-blue-200 mt-0.5">ID: {selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="text-blue-200 hover:text-white transition p-1 bg-blue-900/50 hover:bg-blue-900 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Section 1: Customer Info */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <User size={16} className="text-blue-600" />
                  Informasi Pelanggan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Nama Pelanggan</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.customerEmail}</p>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-200 text-sm">
                  <p className="text-gray-500 flex items-center gap-1">
                    <MapPin size={14} className="text-blue-600" />
                    Alamat Pengiriman
                  </p>
                  <p className="font-semibold text-gray-900 mt-1 whitespace-pre-line leading-relaxed">{selectedOrder.customerAddress}</p>
                </div>
                
                {selectedOrder.notes && (
                  <div className="pt-2 border-t border-gray-200 text-sm">
                    <p className="text-gray-500 flex items-center gap-1">
                      <FileText size={14} className="text-blue-600" />
                      Catatan dari Pelanggan
                    </p>
                    <p className="font-medium text-gray-700 mt-1 italic bg-amber-50 border border-amber-100 p-2.5 rounded-lg">
                      "{selectedOrder.notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Section 2: Product Items */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                  <Package size={16} className="text-blue-600" />
                  Rincian Produk
                </h3>
                <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
                  {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex gap-4 hover:bg-gray-50 transition">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-950 text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Ukuran: <span className="font-semibold text-gray-700">{item.size}</span> | 
                            Warna: <span className="font-semibold text-gray-700">{item.color}</span>
                          </p>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <p className="text-xs text-gray-500">
                            {item.quantity || 1} x Rp{item.price.toLocaleString('id-ID')}
                          </p>
                          <p className="font-semibold text-sm text-gray-900">
                            Rp{((item.quantity || 1) * item.price).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Summary & Status Info */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50 text-sm">
                <div>
                  <p className="text-gray-500 flex items-center gap-1">
                    <Calendar size={14} />
                    Tanggal Pesanan
                  </p>
                  <p className="font-semibold text-gray-900 mt-0.5">
                    {new Date(selectedOrder.date).toLocaleDateString('id-ID', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500">Total Pembayaran</p>
                  <p className="font-bold text-xl text-blue-950 mt-0.5">Rp{selectedOrder.total.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm font-semibold text-gray-700">Ubah Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    handleStatusChange(selectedOrder.id, e);
                    // Update state lokal modal agar tersinkronisasi instan di UI modal
                    setSelectedOrder(prev => ({ ...prev, status: e.target.value }));
                  }}
                  disabled={selectedOrder.status === 'Selesai' || selectedOrder.status === 'Dibatalkan'}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white font-medium disabled:bg-gray-100 disabled:text-gray-500 cursor-pointer disabled:cursor-not-allowed"
                >
                  {getAllowedStatuses(selectedOrder.status).map((statusOpt) => (
                    <option key={statusOpt} value={statusOpt}>{statusOpt}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-950 text-white font-semibold rounded-xl hover:bg-blue-800 transition text-sm shadow-md"
              >
                Tutup
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
