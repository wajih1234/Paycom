import React, { useState } from 'react';
import '../styles/components/settings.css'; 
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { jwtDecode}  from 'jwt-decode';


const Settings =( ) =>{
    const [email,setEmail]=useState('');
    const [currentpassword,setCurrentPassword]=useState('');
    const [newpassword,setNewPassword]=useState('');
    
    const handleset = async (event) => {
      event.preventDefault();
      if(!email || !currentpassword || !newpassword) return;
      try{
        const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/update-acc', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',
            'x-auth-token': token
         },
        body: JSON.stringify({ email, currentpassword,newpassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'updating failed');
      }


      }catch (error) {
      alert('there is somthing wrong');
    }

    };
    const navigate = useNavigate();

   const handleBack = () => {
     const token = localStorage.getItem('token');
      if (token) {
         const decoded = jwtDecode(token);
         console.log("Decoded token:", decoded);
  console.log("Decoded role:", decoded.role);
        if (decoded.user.role === 'admin') {
      navigate('/admidashboard');
       } else {
      navigate('/dashbaord');
    }
  } else {
    navigate('/login');
  }
};




     return (
        <div className='set'>
        <form >
         <h3 
             onClick={handleBack} 
           style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
            <IoMdArrowRoundBack /> Back
             </h3>

            <input type="email" placeholder="New email"   value={email}
          onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="Current password" value={currentpassword} onChange={(e)=> setCurrentPassword(e.target.value)} />
            <input type="password" placeholder="New password" value={newpassword} onChange={(e)=> setNewPassword(e.target.value)} />
            <button  onClick={handleset}> update</button>
        </form>

        </div>

     );

};
export default Settings;