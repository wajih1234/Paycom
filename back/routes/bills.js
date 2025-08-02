
const express = require('express');
const router = express.Router();
const { adminAuth,auth } = require('../middleware/auth');
const Bill = require('../controllers/bill');
const Transaction = require('../controllers/transaction');

// Existing bill routes
router.post('/pay', auth, Bill.payBill);
router.get('/', auth, Bill.getBills);


// Add transaction routes here
router.get('/transactions', auth, Transaction.getUserTransactions); // User sees their transactions
router.get('/transactions/all', auth, adminAuth, Transaction.getAllTransactions); // Admin sees all

// the admin see the bills of all users 
router.get('/all', auth, adminAuth, Bill.getAllbills); // Admin sees all

// the admin add new bill
router.post('/addbill', auth, adminAuth, Bill.createNewbill);


module.exports = router;