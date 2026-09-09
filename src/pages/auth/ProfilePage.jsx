import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export default function ProfilePage() {
  const { currentUser, updateProfile } = useAuth();
  const { orders } = useDatabase();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      setName(currentUser.name || '');
      setAddress(currentUser.address || '');
      setPhone(currentUser.phone || '');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(name, address, phone);
    setIsEditing(false);
  };

  const myOrders = orders.filter((o) => o.customerEmail === currentUser.email);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-blue-950 mb-6">Profil Saya</h2>
        
        {!isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Nama</p>
                <p className="font-semibold text-gray-800 text-lg">{currentUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-800 text-lg">{currentUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nomor Telepon</p>
                <p className="font-semibold text-gray-800 text-lg">{currentUser.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Alamat Utama</p>
                <p className="font-semibold text-gray-800 text-lg">{currentUser.address || '-'}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              className="mt-6 bg-blue-950 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 transition shadow-md inline-block"
            >
              Edit Profil
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama</label>
              <input type="text" required value={name} onChange={e=>setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email (Tidak bisa diubah)</label>
              <input type="email" disabled value={currentUser.email} className="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2 mt-1 text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
              <input type="text" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alamat Utama</label>
              <textarea rows="3" value={address} onChange={e=>setAddress(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 resize-none focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div className="flex gap-4 pt-4">
              <button type="submit" className="bg-blue-950 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition">
                Simpan Perubahan
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition">
                Batal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
