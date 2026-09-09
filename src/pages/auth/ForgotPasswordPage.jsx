import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const { resetPassword } = useAuth();

  const handleVerifyEmail = (e) => {
    e.preventDefault();
    // In a real app, we would send an email. Here we just move to step 2 to input new password.
    if(email) {
      setStep(2);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const result = resetPassword(email, newPassword);
    setMessage({
      text: result.message,
      type: result.success ? 'success' : 'error'
    });
    
    if (result.success) {
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-950">
          Reset Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message.text && (
            <div className={`p-3 rounded-md text-sm mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
              {message.text}
            </div>
          )}

          {step === 1 && (
            <form className="space-y-6" onSubmit={handleVerifyEmail}>
              <p className="text-sm text-gray-600">Masukkan email Anda untuk mereset password.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-950 hover:bg-blue-900">
                Lanjut
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <p className="text-sm text-gray-600">Buat password baru untuk {email}</p>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password Baru</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-950 hover:bg-blue-900">
                Reset Password
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-6">Password Anda berhasil diubah. Silakan masuk kembali.</p>
              <Link to="/login" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-950 hover:bg-blue-900">
                Kembali ke Login
              </Link>
            </div>
          )}

          {step !== 3 && (
            <div className="mt-6 text-center">
              <Link to="/login" className="font-medium text-sm text-blue-600 hover:text-blue-500">
                Kembali ke halaman login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
