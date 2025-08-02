import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/admindash.css';
import { MdAddCircleOutline } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";
import { IoStatsChartSharp } from "react-icons/io5";
import PaymentHistoryChart from './PaymentHistoryChart';
 
const Dashboard =()=>{
    const [users,setUsers]=useState([]);
    const [bills,setBills]=useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingBills, setLoadingBills] = useState(false);
    const [showBills, setShowBills] = useState(false);
    const [searchTerm,setSearchTerm]=useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
   

     const toggleBills = () => {
  setShowBills(prev => !prev);
 };

    useEffect(() => {
        const fetchUsers = async () => {
          
          try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users/', {
              method:'GET', 
              headers: { 'x-auth-token': token,
                'Content-Type': 'application/json'
              }
            });
            const data = await response.json();
            console.log("Fetched users data:", data);
           if (Array.isArray(data)) {
            setUsers(data);
                } else {
               console.error("users data is not an array:", data);
               setUsers([]); // fallback
                    }
    
          } catch (error) {
            console.error("Error fetching users:", error);
           
          } finally {
            setLoadingUsers(false);
          }
        };
    
        fetchUsers();
      }, []);

      

     useEffect(() => {
         const fetchBills = async () => {
          setLoadingBills(true);
          
           try {
             const token = localStorage.getItem('token');
             const response = await fetch('http://localhost:5000/api/bills/all', {
               method:'GET',
               headers: { 'x-auth-token': token}
             });
             const data = await response.json();
             console.log("Fetched  all bills data:", data);
            if (Array.isArray(data)) {
             setBills(data);
                 } else {
                console.error("Bills data is not an array:", data);
                setBills([]); 
                     }
     
           } catch (error) {
             console.error("Error fetching bills:", error);
           } finally {
        setLoadingBills(false); 
    }
         };
     
         fetchBills();
       }, []);
     
     const updateUserStatus = async (userId, newStatus) => {
        try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/users/sta', {
      method: 'PUT',
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        status1: newStatus
      })
    });

    const data = await response.json();
    
    if (response.ok) {
     
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status1: newStatus } : user
      ));
      console.log(data.msg); 
    } else {
      console.error('Update failed:', data);
    }
  } catch (error) {
    console.error('Error updating user status:', error);
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
 const handleSuggestionClick = (name) => {
  setSearchTerm(name);
  setShowSuggestions(false);
};

const filteredUsers = users.filter((user) => {
  const search = searchTerm.toLowerCase();
  const role = (user.role || '').toLowerCase();

  if (role === 'admin') {
    return false; 
  }
  
  return (
    (user.name && user.name.toLowerCase().includes(search) ) ||
    (user.status1 && user.status1.toLowerCase().includes(search))
  );
});
const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
        alert("No data to export.");
        return;
    }

    const replacer = (key, value) => value === null ? '' : value; 
    const header = Object.keys(data[0]);
    const csv = [
        header.join(','), 
        ...data.map(row => header.map(fieldName => 
            JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

    

    
return(
    
    <div className='allpage'>
        <nav className="dashnav">
                    <div className="dashbrand">Paycom</div>
                    <div className="dashlinks">
                      <Link to="/settings" className="link">Settings</Link>
                      <Link to="/" className="link">Log out</Link>
                    </div>
        </nav>
       <div className='allcontent'>
        <div className='adminmenu'>
        <ul>
           <li><h1><MdAdminPanelSettings />Admin</h1></li>
           <li className='roleadmin'><Link to="/addbill" ><MdAddCircleOutline />  <span>Add bill</span></Link></li>
           <li  className="roleadmin"> <Link to="/chart" > <IoStatsChartSharp />  <span>Stats</span></Link></li>


        </ul>




        </div>
        <div className='dataofadmin'>
        
           
         <div className='buttonadmin'>
         <div className='buttonbill'>
         <button 
                onClick={() => exportToCSV(users, 'users.csv')} 
                className="cool-btn btn-secondary"
            >
                Export Users
            </button>
          <button onClick={toggleBills}
          className="transactions-toggle-btn">{showBills ? 'Show users' : 'bills'}</button>
           
         </div>
         <div className='searchadmin'>
            <input
             type='text'          
             className='form-control2'
             placeholder='Search for users'
              onChange ={handleSearchChange}
              />
              {showSuggestions && (
              <div className="suggestions-dropdown">
              {filteredUsers.length > 0 ? (
                 filteredUsers.slice(0, 5).map((user) => ( 
                   <div
                     key={user._id}
                 className="suggestion-item"
                onClick={() => handleSuggestionClick(user.name)}
                 >
          {user.name}
        </div>

      ))
    ) : (
      <div className="suggestion-item">No matches</div>
    )}
  </div>
)}


             
           </div>
          

         </div>
         {showBills && (
        <div className="allbills-table-container">
          {loadingBills ? (
            <p>Loading bills...</p>
          ) : bills.length === 0 ? (
            <p>No transactions found</p>
          ) : (
            <table className="allbills-table">
              <thead>
                <tr>
                  <th>billid</th>
                  <th>userid</th>
                  <th>provider</th>
                  <th>amount</th>
                  <th>status</th>
                  <th>dueDate</th>
                  

                </tr>
              </thead> 
                          
              <tbody>
                {bills.map((bill) => (
              <tr key={bill._id}>
               <td>{bill._id}</td>
               <td>{bill.userId}</td>
              <td>{bill.provider }</td>
              <td>{bill.amount}</td>
              <td>{bill.status }</td>
              <td>{bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : 'N/A'}</td>
              </tr>
               ))}
              </tbody>
            </table>
          )}</div> 
      )}            
        
         
            {!showBills &&(
          
            loadingUsers ? (
           <p>Loading users...</p>
         ) : users.length === 0 ? (
           <p>No users found</p>
         ) : (
              
               

       
             <table className="users-table">
               <thead>
                 <tr>
                  <th>userid</th>
                   <th>name</th>
                   <th>email</th>
                   <th>status1</th>
                   <th>Action</th>
                 </tr>
               </thead>
               <tbody>
                 {filteredUsers.map((user) => (
                   <tr key={user._id}>
                   <td>{user._id}</td>
                     <td>{user.name}</td>
                     <td>{user.email}</td>
                     <td>{user.status1}</td>
                     <td>
                      {user.status1 === 'active' && (
                       <button className="cool-btn btn-secondary"     onClick={() => updateUserStatus(user._id, 'blocked')} >
                             Block
                       </button>
                        )}
                     {user.status1 === 'blocked' && (
                     <button className="cool-btn btn-primary"    onClick={() =>  updateUserStatus(user._id, 'active')} >
                       Activate
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

export default Dashboard;