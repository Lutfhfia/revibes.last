import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword } = useAuth();
  const token = searchParams.get('token');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(token, password);
      setIsComplete(true);
    } catch (resetError) {
      setError(resetError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-blue-950">
          Buat Password Baru
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isComplete ? (
            <div className="space-y-5 text-center">
              <p className="text-sm text-green-700">
                Password berhasil diubah. Silakan masuk kembali.
              </p>
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-blue-950 hover:bg-blue-900"
              >
                Kembali ke Login
              </Link>
            </div>
          ) : !token ? (
            <div className="space-y-5 text-center">
              <p role="alert" className="text-sm text-red-600">
                Tautan reset tidak valid. Minta tautan baru dari halaman lupa password.
              </p>
              <Link
                to="/forgot-password"
                className="font-medium text-sm text-blue-600 hover:text-blue-500"
              >
                Minta tautan reset baru
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <p role="alert" className="p-3 rounded-md text-sm bg-red-50 text-red-600">
                  {error}
                </p>
              )}
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  Password baru
                </label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Konfirmasi password baru
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-blue-950 hover:bg-blue-900 disabled:opacity-60"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan password baru'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
