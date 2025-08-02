import React ,{useState,useEffect} from 'react';
import '../styles/components/profil.css';
import { Link } from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import { jwtDecode}  from 'jwt-decode';



const Profil=()=>{
const [userName, setUserName] = useState('User');
const [userEmail,setUserEmail] =useState('User');
const [bills, setBills] = useState([]);
const [loadingBills, setLoadingBills] = useState(true); 



useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const decoded = jwtDecode(token);
             console.log('token:', decoded);
            setUserName(decoded.user.name || 'User');
             setUserEmail(decoded.user.email || 'No Email');
          } catch (err) {
            console.error("Failed to decode token:", err);
          }
        }
      }, []);

      useEffect(() => {
          const fetchBills = async () => {
            setLoadingBills(true);
            try {
              const token = localStorage.getItem('token');
              const response = await fetch('http://localhost:5000/api/bills/', {
                method:'GET', // Adjust endpoint
                headers: { 'x-auth-token': token}
              });
              const data = await response.json();
              console.log("Fetched bills data:", data);
             if (Array.isArray(data)) {
              setBills(data);
                  } else {
                 console.error("Bills data is not an array:", data);
                 setBills([]); // fallback
                      }
      
            } catch (error) {
              console.error("Error fetching bills:", error);
            } finally {
              setLoadingBills(false);
            }
          };
      
          fetchBills();
        }, []);
        const paidBills = bills.filter(bill => bill.status === 'paid').length;
    return (
       <div className='profile-container'>
      <nav className='profile-nav'>
        <div className="profile-brand">Paycom</div>
        <div className="profile-links">
          <Link to="/settings" className="profile-link">Settings</Link>
          <Link to="/" className="profile-link">Log out</Link>
        </div>
      </nav>
      
      <div className='profile-content'>
        <div className='profile-header'>
          <div className='profile-avatar'>
            <FaRegUser size={90} className='profile-icon' />
          </div>
          <h1 className='profile-username'>{userName}</h1>
        </div>
        
        <div className='profile-details'>
          <div className='profile-detail-item'>
            <span className='detail-label'>Name:</span>
            <span className='detail-value'>{userName}</span>
          </div>
          <div className='profile-detail-item'>
            <span className='detail-label'>Email: </span>
            <span className='detail-value'>  {userEmail}</span>
          </div>
          <div className='profile-detail-item'>
            <span className='detail-label'>Paid bills:</span>
            <span className='detail-value'>{paidBills}</span>
          </div>
        </div>
      </div>
    </div>
   



    );

};
export default Profil;