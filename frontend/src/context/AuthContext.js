import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            userId: decoded.userId,
            email: decoded.sub,
            role: decoded.role,
            name: localStorage.getItem('userName'),
            doctorId: localStorage.getItem('doctorId'),
          });
        } else {
          localStorage.clear();
        }
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (authResponse) => {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('userName', authResponse.name);
    localStorage.setItem('userRole', authResponse.role);
    localStorage.setItem('userId', authResponse.userId);
    if (authResponse.doctorId) {
      localStorage.setItem('doctorId', authResponse.doctorId);
    }
    setUser({
      userId: authResponse.userId,
      email: '',
      role: authResponse.role,
      name: authResponse.name,
      doctorId: authResponse.doctorId,
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
