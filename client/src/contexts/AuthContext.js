// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if the user is already logged in (using localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signup = async (userId, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { userId, password });
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Signup failed' };
    }
  };

  const signin = async (userId, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', { userId, password });
      console.log(response.data)
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } 
      return response.data;
    } catch (error) {
      console.error('Signin error:', error);
      // return { success: false, message: 'Signin failed' };
    }
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, signup, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
