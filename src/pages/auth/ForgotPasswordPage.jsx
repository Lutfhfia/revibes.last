import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      setMessage(await requestPasswordReset(email));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-3xl font-extrabold text-blue-950">
          Reset Password
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div role="alert" className="p-3 rounded-md text-sm mb-4 bg-red-50 text-red-600">
              {error}
            </div>
          )}

          {message ? (
            <div role="status" className="space-y-4">
              <p className="p-3 rounded-md text-sm bg-green-50 text-green-700">
                {message}
              </p>
              <p className="text-sm text-gray-600">
                Periksa juga folder spam. Tautan berlaku selama 30 menit.
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <p className="text-sm text-gray-600">
                Masukkan email akun Anda. Kami akan mengirim tautan untuk membuat password baru.
              </p>
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-950 hover:bg-blue-900 disabled:opacity-60"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim tautan reset'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="font-medium text-sm text-blue-600 hover:text-blue-500">
              Kembali ke halaman login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
