
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { auth, adminAuth } = require('../middleware/auth');
const { getUserTransactions, getAllTransactions } = require('../controllers/transaction');
const Transaction = require('../models/Transaction');
// the user get his transactions
router.get('/', auth, getUserTransactions);

// the admin see  all users transactions
router.get('/all', auth, adminAuth, getAllTransactions);
//to make a chart for the admin
router.get('/payments-history',auth,adminAuth,async(req,res) =>{
  try{
    const transactions = await Transaction.find().sort({ timestamp: 1 });
     const payments = transactions.map(t => ({
      date: t.timestamp,
      amount: t.amount,
    }));
      res.json(payments);

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
  
    
});


// to upload 
router.post('/upload-receipt', auth, async (req, res) => {
  try {
    const { transactionId } = req.body;
    if (!req.files || !req.files.receipt) {
      return res.status(400).send('No PDF file uploaded.');
    }

    const receiptFile = req.files.receipt;
    
    // Validate file type (PDF only)
    if (!receiptFile.mimetype.includes('pdf')) {
      return res.status(400).send('Only PDF files are allowed.');
    }

    // Check file size (e.g., 5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (receiptFile.size > maxSize) {
      return res.status(400).send('File too large (max 5MB).');
    }

    // Update transaction with PDF binary data
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).send('Transaction not found.');
    }

    // Ensure user owns the transaction
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).send('Unauthorized.');
    }

    transaction.receipt = receiptFile.data; // Binary data (Buffer)
    transaction.receiptContentType = receiptFile.mimetype; // "application/pdf"
    await transaction.save();

    res.send('Receipt uploaded successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


//donwload the  receipt from the database 
router.get('/download-receipt/:transactionId', auth, async (req, res) => {
  try {
   
    const { transactionId } = req.params;

    // (1) Check if transactionId is missing
    if (!transactionId) {
      return res.status(400).json({ error: "Transaction ID is required." });
    }

    // (2) Check if transactionId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ error: "Invalid Transaction ID format." });
    }





    const transaction = await Transaction.findById(req.params.transactionId);
    if (!transaction || !transaction.receipt) {
      return res.status(404).send('Receipt not found.');
    }

    // Verify user owns the transaction
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).send('Unauthorized.');
    }

    // Set headers and send PDF
    res.set('Content-Type', transaction.receiptContentType);
    res.set('Content-Disposition', `attachment; filename=receipt_${transaction._id}.pdf`);
    res.send(transaction.receipt);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});





// to make the chart  for the user 
router.get('/user/payments-history/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;
      if (!userId || userId === 'null') {
  return res.status(400).json({ msg: 'Invalid userId provided' });
  }
   
    const transactions = await Transaction.find({ userId }).sort({ timestamp: 1 });

  
    const payments = transactions.map(t => ({
      date: t.timestamp,
      amount: t.amount,
    }));

    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;