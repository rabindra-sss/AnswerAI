// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.js';
import Navbar from './components/Navbar';
// import Signup from './pages/Signup.jsx';
// import Signin from './pages/Signin.jsx';
import CompareScoring from './pages/CompareScoring';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            {/* <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} /> */}
            <Route path="/" element={<CompareScoring />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
