import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { Package, MapPin } from 'lucide-react';

export default function MyOrdersPage() {
  const { currentUser } = useAuth();
  const { orders } = useDatabase();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const myOrders = orders.filter((o) => o.customerEmail === currentUser.email);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-blue-950 mb-8 flex items-center gap-3">
        <Package className="text-blue-600" size={32} />
        Riwayat Pesanan
      </h2>

      {myOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <Package size={48} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum Ada Pesanan</h3>
          <p className="text-gray-500 mb-8">Ayo mulai belanja dan temukan koleksi terbaik kami.</p>
          <button onClick={()=>navigate('/shop')} className="bg-blue-950 text-white px-8 py-3 rounded-full hover:bg-blue-800 transition font-medium shadow-md">
            Belanja Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-blue-950 text-lg">{order.id}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                      order.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                      order.status === 'Menunggu Pembayaran' ? 'bg-red-100 text-red-700' :
                      order.status === 'Dibatalkan' ? 'bg-gray-200 text-gray-600' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Dipesan pada {new Date(order.date).toLocaleDateString('id-ID', { year:'numeric', month:'long', day:'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Pembayaran</p>
                  <p className="font-bold text-xl text-blue-950">Rp{order.total.toLocaleString('id-ID')}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.quantity || 1}x | Ukuran: {item.size} | Warna: {item.color}</p>
                    </div>
                    <div className="text-right font-medium text-gray-900">
                      Rp{((item.quantity || 1) * item.price).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 flex gap-3 items-start border border-gray-100">
                <MapPin className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium text-gray-800 text-sm">Dikirim ke: {order.customerName}</p>
                  <p className="text-sm text-gray-600 mt-1">{order.customerAddress}</p>
                  {order.notes && <p className="text-sm text-gray-500 italic mt-1">Catatan: {order.notes}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              {order.status === 'Menunggu Pembayaran' && (
                <div className="mt-6 flex justify-end">
                  <Link to={`/payment/${order.id}`} className="bg-blue-950 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition shadow-sm">
                    Bayar Sekarang
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
