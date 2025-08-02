import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/components/home.css';  
import ima3 from '../assets/ima.jpg';

const Home = () => {
  return (
    <div className="paycom-container">
      
      <nav className="paycom-nav">
        <div className="nav-brand">Paycom</div>
        <div className="nav-links">
          <Link to="/Login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link">Sign Up</Link>
        </div>
      </nav>

    

      <main className="paycom-main">
        <div className="paycom-hero">
    <div className="hero-text">
      <h1>Redefining Digital Payments</h1>
      <p className="hero-subtitle">Send and spend  money globally with no fees</p>
      
      <div className="hero-stats">
        <div className="stat-item">
          <span className="stat-number">1M+</span>
          <span className="stat-label">Active Users</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">90+</span>
          <span className="stat-label">Countries</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Support</span>
        </div>
      </div>
    </div>
    
    <div className="hero-visual">
      <img src={ima3} alt="secure payment" className="main-image" />
      <div className="floating-badge">
        <span>🏆</span>
        <p>Best FinTech App 2025</p>
      </div>
    </div>
  </div>


  <div className="security-notice-modern">
    <div className="notice-header">
      <div className="shield-icon">🛡️</div>
      <h3>Your Security is Our Priority</h3>
    </div>
    
    <div className="security-features">
      <div className="security-card">
        <div className="security-icon">🔒</div>
        <div>
          <h4>End-to-End Encryption</h4>
          <p>Transactions are secured  to keep your data safe at all times.</p>
        </div>
      </div>
      
      <div className="security-card">
        <div className="security-icon">🔔</div>
        <div>
          <h4>Real-Time Alerts</h4>
          <p>Instant notifications for all account activity</p>
        </div>
      </div>
      
      <div className="security-card">
        <div className="security-icon">👁️</div>
        <div>
            <h4>Transaction Visibility</h4>
          <p>Full audit trail with timestamps for every payment</p>
         </div>
      </div>
    </div>
    
    
  </div>


      </main>
  <div className="steps-section">
  <h2   className='stepshead'>How Paycom Works</h2>
  <div className="steps">
    <div className="step">
      <div className="step-number">1</div>
      <h3>Sign Up</h3>
      <p>Create your free account in 1 minute</p>
    </div>
    <div className="step">
      <div className="step-number">2</div>
      <h3>Connect</h3>
      <p>Link your bank or card securely</p>
    </div>
    <div className="step">
      <div className="step-number">3</div>
      <h3>Pay</h3>
      <p>Finalize the payment</p>
    </div>
  </div>
</div>
<div className="payment-icons">
  <div className="icon">💳</div>
  <div className="icon">💰</div>
  <div className="icon">📱</div>
  <div className="icon">🛒</div>
</div>
<div className="about-section">
  <div className="about-content">
    <h2>Why Choose Paycom?</h2>
    <p>
      Founded in 2025, Paycom revolutionizes digital payments with  <span className="highlight"> zero fees </span>and
     
      <span className="highlight"> instant transfers</span>. 
      We serve over 1 million users worldwide.
    </p>
  </div>
  
</div>
<div className="content-container">
  <div className="text-content">
    <div className="cta-banner">
      <h2>Start Paying Smarter with Paycom</h2>
      <p>Take control of your payments with a seamless, secure experience.Sign up today and discover how easy online payments can be with Paycom.</p>
      
    </div>
  </div>
  
  <div className="contact-section" style={{ '--contact-bg-color': '#ffffff' }}>
    <h3>Contact Us</h3>
    <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
      <div className="form-group">
        <input 
          type="text" 
          id="name" 
          placeholder=" " 
          required 
        />
        <label htmlFor="name">Full Name</label>
      </div>

      <div className="form-group">
        <input 
          type="email" 
          id="email" 
          placeholder=" " 
          required 
        />
        <label htmlFor="email">Email Address</label>
      </div>

      <div className="form-group">
        <input 
          type="text" 
          id="subject" 
          placeholder=" " 
          required 
        />
        <label htmlFor="subject">Subject</label>
      </div>

      <div className="form-group">
        <textarea 
          id="message" 
          rows="4" 
          placeholder=" " 
          required 
        ></textarea>
        <label htmlFor="message">Your Message</label>
      </div>

      <button type="submit" className="submit-btn">
        Send Message
      </button>
    </form>
  </div>
</div>

      
      <footer className="paycom-footer">
        <div className="footer-content">
          <p>© All rights reserved Paycom 2025</p>
          
          
          
        </div>
      </footer>
    </div>
  );
};

export default Home;