import React, { useState } from 'react';

import '../styles/components/signup.css'; 

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const handleSign = async (event) => {
    event.preventDefault(); 

    if (!name || !email || !password ) return; 

    try {
      
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: email.trim(),password }),
      });

      if (response.ok) {
        alert('registration succed');
        
      } else {
        const data = await response.json();
        alert(data.msg || JSON.stringify(data) || 'failed to register');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="signOuterContainer">
      <div className="signInnerContainer">
        <h1 className="heading">Sign</h1>
        <input
          placeholder="Name"
          className="signInput"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="email"
          className="emailInput mt-20"
          type="text"
          value={email}
         onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="password"
          className="passwordInput mt-20"
          type="password"
          value={password}
         onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSign} className="button mt-20" type="submit">
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Signup;