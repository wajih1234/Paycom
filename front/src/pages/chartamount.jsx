import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const Chartamount = () => {
  const [payments, setPayments] = useState([]);

 useEffect(() => {
  const fetchPayments = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/transactions/payments-history`, { 
        headers: { 'x-auth-token': token,
            'Content-Type': 'application/json'
         },
      });
      if (response.status === 401) {
        console.error('Unauthorized - token may be invalid');
        // Clear invalid token and redirect
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
     const paymentsData = Array.isArray(data) 
        ? data 
        : (data.data || data.payments || []);
        
      setPayments(paymentsData);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  fetchPayments();
}, []);

const chartData = React.useMemo(() => {
    const paymentsCountByDay = payments.reduce((acc, payment) => {
      const day = new Date(payment.date).toLocaleDateString();
      acc[day] = (acc[day] || 0) + (Number(payment.amount) || 0);
      return acc;
    }, {});

   const labels = Object.keys(paymentsCountByDay).sort(
  (a, b) => new Date(a) - new Date(b)
      );
    const counts = Object.values(paymentsCountByDay);

    return {
      labels,
      datasets: [
        {
          label: ' sum of amount',
          data: counts,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          tension: 0.2,
        },
      ],
    };
  }, [payments]);

  return (
    <div className="chart-inner">
      <Line data={chartData} />
    </div>
  );

  
};

export default Chartamount;
