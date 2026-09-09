import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('thriftShopUser');
    return saved ? JSON.parse(saved) : null;
  });

  const API_URL = 'http://localhost:5000/api/auth';

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('thriftShopUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('thriftShopUser');
    }
  }, [currentUser]);

  const login = async (email, password) => {
    let response;

    try {
      response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });
    } catch {
      throw new Error('Backend belum aktif. Jalankan dulu: node backend/server.js');
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    
    setCurrentUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);

    setCurrentUser(data);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = async (updates) => {
    if (!currentUser) return;
    const response = await fetch(`${API_URL}/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentUser.email, ...updates })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);

    setCurrentUser(data);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
