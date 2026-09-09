import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { ShoppingBag, Package, MessageCircle, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const { orders, products } = useDatabase();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const totalRevenue = orders
    .filter(o => o.status === 'Selesai' || o.status === 'Dikirim')
    .reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-950 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-xl">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pendapatan</p>
            <p className="text-xl font-bold text-gray-900">Rp{totalRevenue.toLocaleString('id-ID')}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-orange-100 text-orange-600 p-4 rounded-xl">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pesanan Baru</p>
            <p className="text-xl font-bold text-gray-900">{pendingOrders}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-100 text-purple-600 p-4 rounded-xl">
            <Package size={28} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Produk</p>
            <p className="text-xl font-bold text-gray-900">{products.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/products/add" className="bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition rounded-xl p-4 flex flex-col items-center justify-center gap-2">
              <Package className="text-blue-600" />
              <span className="font-medium text-gray-700">Tambah Produk</span>
            </Link>
            <Link to="/admin/products" className="bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition rounded-xl p-4 flex flex-col items-center justify-center gap-2">
              <ShoppingBag className="text-blue-600" />
              <span className="font-medium text-gray-700">Kelola Produk</span>
            </Link>
            <Link to="/admin/orders" className="bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition rounded-xl p-4 flex flex-col items-center justify-center gap-2">
              <TrendingUp className="text-blue-600" />
              <span className="font-medium text-gray-700">Kelola Pesanan</span>
            </Link>
            <Link to="/admin/chat" className="bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition rounded-xl p-4 flex flex-col items-center justify-center gap-2">
              <MessageCircle className="text-blue-600" />
              <span className="font-medium text-gray-700">Pesan Masuk</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pesanan Terbaru</h2>
          {orders.slice(0, 5).map(order => (
            <div key={order.id} className="flex justify-between items-center py-3 border-b last:border-0">
              <div>
                <p className="font-medium text-gray-800">{order.id}</p>
                <p className="text-xs text-gray-500">{order.customerName}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-950">Rp{order.total.toLocaleString('id-ID')}</p>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  order.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-gray-500">Belum ada pesanan.</p>}
        </div>
      </div>
    </div>
  );
}
