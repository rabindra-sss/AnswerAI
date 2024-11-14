// Signin.jsx
import React, { useState, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { signin } = useContext(AuthContext);

  const navigate= useNavigate();
  
  const handleSignin = async (e) => {
    e.preventDefault();
    const result = await signin(userId, password);
    if (result.success) {
        alert("login success")
    } else {
      alert(result.message);
    }
  };

  return (
    <form onSubmit={handleSignin}>
      <h2>Signin</h2>
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
      <button type="submit">Signin</button>
    </form>
  );
};

export default Signin;
