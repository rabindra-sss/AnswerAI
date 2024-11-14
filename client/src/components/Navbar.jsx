// Navbar.jsx
import React, { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import './Navbar.css'
const Navbar = () => {
  const { user, signout } = useContext(AuthContext);

  return (
    <nav>
      <h1>My App</h1>
      {user ? (
        <>
          <span>Welcome, User
            {user.userId}
          </span>
          <button onClick={signout}>Signout</button>
        </>
      ) : (
        <>
          <a href="/signin">Signin</a>
          <a href="/signup">Signup</a>
        </>
      )}
    </nav>
  );
};

export default Navbar;
