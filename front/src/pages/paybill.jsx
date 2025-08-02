import React, { useState,useEffect } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/components/paybill.css'; 
const PayBill = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bill } = location.state || {};
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [useSavedCard, setUseSavedCard] = useState(false);
  const [hasSavedCard, setHasSavedCard] = useState(false);
  

    useEffect(() => {
    const checkSavedCard = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/auth/user', {
          method: 'GET',
          headers: { 'x-auth-token': token }
        });
        const userData = await response.json();
        const hasCard = !!(userData.savedCard && userData.savedCard.last4);
        setHasSavedCard(hasCard);
        setUseSavedCard(hasCard); // Auto-enable if card exists
      } catch (error) {
        console.error("Error checking saved card:", error);
      }
    };

    checkSavedCard();
  }, []);
  useEffect(() => {
  if (hasSavedCard && useSavedCard && bill) {
    handlePaybillAuto();
  }
}, [hasSavedCard, useSavedCard, bill]);

  const handlePaybill = async (event) => {
    event.preventDefault();
    setErrorMsg('');

    if (!cardNumber) {
      setErrorMsg('Card number is required');
      return;
    }

    const cleanedCardNumber = cardNumber.replace(/\D/g, '');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/bills/pay', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ 
          billId: bill._id,
          cardNumber: cleanedCardNumber,
          cvv :useSavedCard ? null : cvv, 
          saveCard,
          useSavedCard
        }),
      });

      const data = await response.json();
       console.log('PAYMENT RESPONSE:', { status: response.status, data }); // Add this
      if (!response.ok) {
        throw new Error(data.msg || 'Payment failed');
      }

      setPaymentSuccess(true);
      setTransactionId(data.transaction._id);

      // 
      await generatePDFReceipt(bill, data.transaction._id);

     
       const pdfBytes = await generatePDFReceipt(bill, data.transaction._id);
       await uploadReceiptToBackend(data.transaction._id, pdfBytes);
      
      
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  if (!bill) {
    return (
      <div className="OuterCont12">
        <p>No bill selected for payment</p>
      </div>
    );
  }
  const handlePaybillAuto = async () => {
  setErrorMsg('');

  try {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:5000/api/bills/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({
        billId: bill._id,
        useSavedCard: true
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Payment failed');
    }

    setPaymentSuccess(true);
    setTransactionId(data.transaction._id);

    const pdfBytes = await generatePDFReceipt(bill, data.transaction._id);
    downloadPDFBytes(pdfBytes, data.transaction._id); // Trigger download once
     uploadReceiptToBackend(data.transaction._id, pdfBytes);
    
   

  } catch (error) {
    setErrorMsg(error.message);
  }
};
const downloadPDFBytes = (pdfBytes, transactionId) => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `receipt_${transactionId}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};



   const generatePDFReceipt = async (bill, transactionId) => {
    try {
      // Create a new PDF
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([400, 600]); // Width, Height in points

      // Set PDF content
      const { width, height } = page.getSize();
      
      // Title
      page.drawText('PAYMENT RECEIPT', {
        x: 50,
        y: height - 50,
        size: 20,
        color: rgb(1, 0, 0),
      });

      // Divider line
      page.drawLine({
        start: { x: 50, y: height - 70 },
        end: { x: width - 50, y: height - 70 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });

      // Transaction Details
      const textYPositions = {
        start: height - 100,
        increment: 30
      };

      const details = [
        `Transaction ID: ${transactionId}`,
        `Date: ${new Date().toLocaleString()}`,
        `Provider: ${bill.provider}`,
        `Amount: $${bill.amount.toFixed(2)}`,
        `Status: Paid`,
      ];

      details.forEach((text, index) => {
        page.drawText(text, {
          x: 50,
          y: textYPositions.start - (index * textYPositions.increment),
          size: 12,
        });
      });

      // Footer
      page.drawText('Thank you for your payment!', {
        x: 50,
        y: 50,
        size: 14,
        color: rgb(0.2, 0.4, 0.8),
      });

      // Generate PDF and trigger download
      const pdfBytes = await pdfDoc.save();
      
      
     
    
      


      return pdfBytes;






    } catch (error) {
      console.error('PDF generation failed:', error);
    }

    
  };

// send it to the back 
const uploadReceiptToBackend = async (transactionId, pdfBytes) => {
 
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('transactionId', transactionId);
    formData.append(
      'receipt',
      new Blob([pdfBytes], { type: 'application/pdf' }),
      `receipt_${transactionId}.pdf`
    );

    const response = await fetch('http://localhost:5000/api/transactions/upload-receipt', {
      method: 'POST',
      headers: { 'x-auth-token': token },
      body: formData,
    });

    if (!response.ok) throw new Error('Receipt upload failed');
    console.log('Receipt uploaded successfully');
  } catch (error) {
    console.error('Error uploading receipt:', error);
  }
};






  return (
    <div className="OuterCont12">
      {paymentSuccess ? (
        <div className="InnerCont1">
          <h3>Payment Successful!</h3>
          <p>Transaction ID: {transactionId}</p>
          <Link to="/dashbaord" className="butt89 mt-20">
            Return to Dashboard
          </Link>
        </div>
      ) : (
        <form className="InnerCont1">
          <h3>Pay Bill: {bill.provider}</h3>
          <p>Amount: ${bill.amount}</p> 

         
          {hasSavedCard && (
          <label className="mt-10">
            <input
              type="checkbox"
              checked={useSavedCard}
              onChange={(e) => setUseSavedCard(e.target.checked)}
            /> Use saved card (••••{hasSavedCard.last4})
          </label>
        )} 

         { !useSavedCard && (
          <>
          <input
            placeholder="Card Number"
            className="cardinput78 mt-20"
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <input
          placeholder="Card Security Code (CVV)"
            className="cardinput78 mt-20"
           type="text"
          maxLength={3}
        value={cvv}
        onChange={(e) => setCvv(e.target.value)}
          />
        
        <label className="mt-10">
        <input
         type="checkbox"
        checked={saveCard}
          onChange={(e) => setSaveCard(e.target.checked)}
           /> Save card for faster payment next time
         </label>
         </>
         )}
          
          {errorMsg && <div className="error-message">{errorMsg}</div>}
          
          <button 
            onClick={handlePaybill} 
            className="butt89 mt-20" 
            type="submit"
          >
            Pay
          </button>
        </form>
      )}
    </div>
  );
};

export default PayBill;
