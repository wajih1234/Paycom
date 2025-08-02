import React, { useState } from 'react';
import '../styles/components/c.css';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            alert('Please enter your email.');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Reset link sent to your email. Check your inbox.');
            } else {
                alert(data.msg || 'Failed to send reset email.');
            }
        } catch (error) {
            alert('Error sending reset email.');
        }
    };

    return (
        <div className="OuterContainer00">
             <div className="forgetnav">
                 <div className="forgetpay">Paycom</div>
        
              </div>
 


            <form className="InnerContainer100" onSubmit={handleForgotPassword}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="button100 mt-20">Send</button>


            </form>
            <footer className="add-footer8">
           <div className="forget-content">
             <p>© All rights reserved Paycom 2025</p>
         
          
          
              </div>
              </footer>

        </div>
    );
};

export default ForgotPassword;
