import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({ user: null, setUser: () => {} });

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Optionally fetch user info here
      setUser({ token });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}