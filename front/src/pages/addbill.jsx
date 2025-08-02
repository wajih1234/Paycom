import React,{useState,useEffect}  from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/addbill.css';
import { IoMdArrowRoundBack } from "react-icons/io";


const Addbill=()=>{
   
    const [provider, setProvider] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    useEffect(() => {
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users/', {
                method: 'GET',
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setUsers(data.filter(user => user.role !== 'admin')); 
            } else {
                console.error("Users data is not an array", data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    fetchUsers();
}, []);


const handleAdd = async (event) => {
   event.preventDefault();
     if ( !provider || !amount || !dueDate) {
    setErrorMsg("Please fill in all fields.");
    return;
}




   if (!selectedUserId) {
        alert("Please select a user.");
        return;
    }

    const billData = {
        userId: selectedUserId,
        provider,
        amount,
        dueDate,
    };







    try {
     

         const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/bills/addbill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
            'x-auth-token': token 
         },
        body: JSON.stringify(billData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'add bill failed');
      }
       alert('Payment succeeded! Bill added.');
      setSelectedUserId('');
       setProvider('');
       setAmount('');
       setDueDate('');
       setErrorMsg('');
     
   

      
      
    } catch (error) {
      setErrorMsg(error.message);
    }

    };






   

      
return(
    <div className='alladd'>
        <div className='navadd'>
            <div className="addbrand">Paycom</div>
                    <div className="nav-links">
                      <Link to="/admidashboard" className="nav-link1"> Admin Dashboard</Link>
                      <Link to="/" className="nav-link2">Home</Link>
                    </div>
        </div>
        <form className='addbillf'>
        <h1>Add bill form</h1>
           <select
    value={selectedUserId}
    onChange={(e) => setSelectedUserId(e.target.value)}
    required
>
    <option value="">Select a user</option>
    {users.map((user) => (
        <option key={user._id} value={user._id}>
            {user.name} 
        </option>
    ))}
</select>
        <input
          placeholder="Provider"
          className="pro"
          type="text"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        />
        <input
          placeholder="amount"
          className="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <br></br>
        <input
          placeholder="dueDate"
          className="ddate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <br></br>
       <button  onClick={handleAdd} className="buttonadd" type="submit">
          Add
        </button>
        
        </form>
     




        <footer className="add-footer">
        <div className="add-content">
          <p>© All rights reserved Paycom 2025</p>
         
          
          
        </div>
      </footer>
    </div>

);


};
export default Addbill;