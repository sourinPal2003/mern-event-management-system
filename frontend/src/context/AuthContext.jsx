'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5001/api';

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { username, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const register = async (username, email, password, confirmPassword, role = 'user') => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        { username, email, password, confirmPassword, role },
        { withCredentials: true }
      );
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
