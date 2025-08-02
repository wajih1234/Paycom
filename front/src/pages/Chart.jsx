import React, { useState,useEffect } from 'react';
import '../styles/components/c1.css';
import PaymentHistoryChart from './PaymentHistoryChart';
import Chartamount from './chartamount';
import Piechart  from './Piechart';
const Chart = () => {
    const [bills,setBills]=useState([]);
       const [transactions, setTransactions] = useState([]);
        const [loadingUsers, setLoadingUsers] = useState(true);
        const [loadingBills, setLoadingBills] = useState(false);

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
        
        


    return (
        <div className="OuterContainer007">
             <div className="forgetnav01">
                 <div className="forgetpay1">Paycom</div>
        
              </div>
 


            <div className='chartcontent2'>
                
          <div className="chart-wrapper">
             <h4 className="chart-title">Number of Payments per Day</h4>
             <PaymentHistoryChart payments={transactions} />
            </div>
            <div className="chart-wrapper">
                <h4 className="chart-title">Total Payment Amount per Day</h4>
               <Chartamount payments={transactions} />
             </div>
             <div className='chart-1'>
            
             <div style={{Width: '300px'}}>
             
               <Piechart bills={bills}   />
             </div>
             
             </div>
            </div>
            <footer className="chartfooter">
           <div className="chart-content1">
             <p>© All rights reserved Paycom 2025</p>
         
          
          
              </div>
              </footer>

        </div>
    );
};

export default Chart;
