import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser,FaLock  } from "react-icons/fa";
import '../styles/components/login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) return;

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, role } = data;

        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        if (role === 'admin') {
          navigate('/admidashboard');
        } else if (role === 'user') {
          navigate('/dashbaord');
        } else {
          setErrorMsg('Unknown role');
        }
      } else {
        setErrorMsg(data.msg || 'Login failed');
        alert('the password or the email is incorrect');
      }
    } catch (error) {
      console.error('Login error:', errorMsg);
      setErrorMsg('Something went wrong. Please try again.');
    }
  };
  


  return (
    
    
    <div className="OuterContainer">
      
        

        
        <form className="InnerContainer1">
        <div className='input-container'>
         <input
          placeholder="Email"
          className="emailInput1"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FaUser  className='icon0'/>
        </div>
        <div className='input-container mt-20'>
          <input
          placeholder="Password"
          className="passwordInput1 mt-20"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FaLock  className='icon1'/>
        </div>
        
        <div className='forget'>
        <section>
                  <input type="checkbox" id="check" />
                  <label htmlFor="check">Remember me</label>
              </section>
              <section>
                  <button
                  type="button"
                 className="forgotPasswordButton"
                onClick={() => navigate('/forgot-password')}
                 >
                I forgot the password
              </button>
              </section>

        </div>

        <button onClick={handleLogin} className="buttonlog" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
