import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBillsData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/bills/all', {
               method:'GET',
               headers: { 'x-auth-token': token}
             }); 
        if (!response.ok) {
          throw new Error('Failed to fetch bills');
        }
        const bills = await response.json();

        // Process data
        const paidBills = bills.filter(bill => bill.status === 'paid');
        
        const providerTotals = {};
        paidBills.forEach(bill => {
          providerTotals[bill.provider] = 
            (providerTotals[bill.provider] || 0) + bill.amount;
        });

        const totalPaid = Object.values(providerTotals).reduce((sum, amount) => sum + amount, 0);
        const providers = Object.keys(providerTotals);
        const percentages = Object.values(providerTotals).map(amount => 
          Math.round((amount / totalPaid) * 100)
        );

        setChartData({
          labels: providers,
          datasets: [{
            data: percentages,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
              '#9966FF', '#FF9F40', '#8AC24A', '#FF5722'
            ],
            borderWidth: 1,
          }]
        });
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBillsData();
  }, []);

  if (loading) return <div>Loading bill data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!chartData) return <div>No paid bills data available</div>;

  return (
    <div className="chart-inner">
       <h4 >Paid Bills by Provider (%)</h4>
      <Pie 
        data={chartData} 
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'right',
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.label}: ${context.raw}%`
              }
            }
          }
        }}
      />
    </div>
  );
};

export default PieChart;
// maintainaspectRatio:true enaable the chart to fill the full width 