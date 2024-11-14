// Signup.jsx
import React, { useState, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useContext(AuthContext);

  const navigate= useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const result = await signup(userId, password);
    if (result.success) {
      navigate('/');
    } else {
      alert(result.message);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Signup</h2>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
