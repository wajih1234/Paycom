import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const PaymentHistoryChart = () => {
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
        headers: { 'x-auth-token': token },
      });
      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  fetchPayments();
}, []);

const chartData = React.useMemo(() => {
    const paymentsCountByDay = payments.reduce((acc, payment) => {
      const day = new Date(payment.date).toLocaleDateString();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(paymentsCountByDay);
    const counts = Object.values(paymentsCountByDay);

    return {
      labels,
      datasets: [
        {
          label: 'Number of Payments',
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

export default PaymentHistoryChart;
