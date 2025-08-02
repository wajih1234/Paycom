import React, { useState, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/userda.css'; 
import { FaRegUser } from "react-icons/fa";
import { jwtDecode}  from 'jwt-decode';
import { LiaMoneyBillSolid } from "react-icons/lia";
import { ImProfile } from "react-icons/im";
import { PDFDocument, rgb } from 'pdf-lib';



const Userdashbaord =()=>{
const [transactions, setTransactions] = useState([]);
const [loading, setLoading] = useState(true);
 const [filteredTransactions, setFilteredTransactions] = useState([]);
const [userName, setUserName] = useState('User');
const [showTransactions, setShowTransactions] = useState(false);
const [searchTerm,setSearchTerm]=useState("");
const [bills, setBills] = useState([]); 
const [loadingBills, setLoadingBills] = useState(true); 
const [hasSavedCard, setHasSavedCard] = useState(false);
const [showSuggestions, setShowSuggestions] = useState(false); 
const didRun = useRef(false);




  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.user.name || 'User');
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);
//
useEffect(() => {
    const checkSavedCard = async () => {
      didRun.current = true;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/auth/user', {
          method: 'GET',
          headers: { 'x-auth-token': token }
        });
        const userData = await response.json();
        console.log(userData);
        setHasSavedCard(!!(userData.savedCard && userData.savedCard.last4));
       
        if (userData.status1 === "blocked") {
          alert(" Your account is blocked, please contact support.");
          
         
          }



      } catch (error) {
        console.error("Error checking saved card:", error);
      }
    };

    checkSavedCard();
  },  []);







// fetch bills
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





  // fetch transactions
    const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/transactions/', {
        method:'GET',
        headers: {
         'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      setTransactions(data);
      setFilteredTransactions(data); // Initially show all transactions
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }; 
  
const handleSearchChange=(event)=>{
  
    const value = event.target.value;
  setSearchTerm(value);
  if (value.trim() !== "") {
    setShowSuggestions(true);
  } else {
    setShowSuggestions(false);
  }
 };
 const handleSuggestionClick = (provider) => {
  setSearchTerm(provider);
  setShowSuggestions(false);
};
const filteredBills = bills.filter((bill) => {
  const search = searchTerm.toLowerCase();
  return (
    (bill.provider && bill.provider.toLowerCase().includes(search)) ||
    (bill.status && bill.status.toLowerCase().includes(search))
  );
});

            
    const toggleTransactions = () => {
    if (!showTransactions) {
      fetchTransactions();
    }
    setShowTransactions(!showTransactions);
  };


  const lastTransaction = transactions.length > 0
  ? transactions.reduce((latest, current) => 
      new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
    )
  : null;

// dowwload function
const downloadReceipt = async (transactionId) => {
  
  
  try {
   


    const token = localStorage.getItem('token');
    const response = await fetch(
      `http://localhost:5000/api/transactions/download-receipt/${transactionId}`,
      { headers: { 'x-auth-token': token } }
    );
    if (!response.ok) {
      const text = await response.text();
      console.error('Error response:', response.status, text);
      alert(`Download failed: ${response.status} - ${text}`);
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${transactionId}.pdf`;
    a.click();
  } catch (error) {
    alert('Download failed');
  }
};
const paidBills = bills.filter(bill => bill.status === 'paid').length;
const unpaidBills = bills.filter(bill => bill.status !== 'paid').length;

    return (


    <div className="all">
    <nav className="dashnav">
            <div className="dashbrand">Paycom</div>
            <div className="dashlinks">
              <Link to="/settings" className="dashlinks">Settings</Link>
              <Link to="/" className="dashlinks">Log out</Link>
            </div>
    </nav>
    <div className='content'>
    <div className='menu'>
    <ul>
      <li className='noun' ><Link to="/profil" className='po9'> <FaRegUser />{userName}</Link>
        
      </li>
      <li  className='noun'>
       <p > <LiaMoneyBillSolid /> Bills</p>
     
      </li>
      

     </ul>
       
     </div>
    <div className='manip'> 
       <div className='data'>
        <div className='pay2'>
          <p>hello, {userName}  you have {unpaidBills} unpaid bills and {paidBills} paid bills.</p>
        </div>
        <div className='pay2'>
         <p> last transaction :</p>
         {lastTransaction ? (
          <h3>${lastTransaction.amount.toFixed(2)}</h3>
        ) : (
          <p>No transactions available</p>
        )}


         </div>
        </div>
        <div className='tableofdata'>
       
        <div className='thebuutonssearch'>
        <div className='but12'>
         <button
          onClick={toggleTransactions}
          className="transactions-toggle-btn">{showTransactions ? 'Show Bills' : 'Transactions'}</button>
           
           
           
           
           
           
           </div>

           <div className='search'>
            <input
             type='text'          
             className='form-control'
             placeholder='Search for bills'
             onChange ={handleSearchChange}
             />  
               {showSuggestions && (
              <div className="suggestions-dropdown1">
              {filteredBills.length > 0 ? (
                 filteredBills.slice(0, 5).map((bill) => ( 
                   <div
                     key={bill._id}
                 className="suggestion-item1"
                onClick={() => handleSuggestionClick(bill.provider)}
                 >
          {bill.provider}
        </div>
      ))
    ) : (
      <div className="suggestion-item">No matches</div>
    )}
  </div>
)}


             
           </div> 
            </div>    

           {showTransactions && (
        <div className="transactions-table-container">
          {loading ? (
            <p>Loading transactions...</p>
          ) : filteredTransactions.length === 0 ? (
            <p>No transactions found</p>
          ) : (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>transactionid</th>
                  <th>userid</th>
                  <th>billId</th>
                  <th>amount</th>
                  <th>hashedcard</th>
                  <th>timestamp</th>

                </tr>
              </thead> 
                          
              <tbody>
                {filteredTransactions.map((transaction) => (
              <tr key={transaction._id}>
               <td>{transaction._id}</td>
               <td>{transaction.userId?._id ?? transaction.userId ?? 'N/A'}</td>
              <td>{transaction.billId?._id ?? transaction.billId ?? 'N/A'}</td>
              <td>${transaction.amount?.toFixed(2) ?? '0.00'}</td>
              <td>{transaction.hashedCard || 'N/A'}</td>
              <td>
              {transaction.timestamp ? new Date(transaction.timestamp).toLocaleString() : 'N/A'}
              </td>
              </tr>
               ))}
              </tbody>
            </table>
          )}</div> // closing for transcations table
      )}            
        
                                  
         

       
       
      </div> 
  {!showTransactions  && (  
   loadingBills ? (
  <p>Loading bills...</p>
) : bills.length === 0 ? (
  <p>No bills found</p>
) : (
    <table className="bills-table">
      <thead>
        <tr>
          <th>Provider</th>
          <th>Amount</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredBills.map((bill) => (
          <tr key={bill._id}>
            <td>{bill.provider}</td>
            <td>${bill.amount.toFixed(2)}</td>
            <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
            <td className={`status ${bill.status}`}>
              {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
           </td>
            <td>
             {bill.status !== 'paid' ? (
              <Link 
               to={`/paybill/${bill._id}`}
              state={{ bill }}  //  This is the correct way in React Router v6
  
               className="pay-button"
                   >
                 Pay
                </Link> )
                    
                      : (
                   <button 
                       className="download-button" 
                     onClick={() => downloadReceipt(bill.transactionId)}  
                    >
                Download
                 </button>
                      )}
            </td>


          </tr>
        ))}
      </tbody>
    </table>
  )
)}
    

    </div>
   

 </div>
  
  




        
 </div>



    );
};
export default Userdashbaord;