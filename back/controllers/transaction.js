const Transaction = require('../models/Transaction');
const { auth, adminAuth } = require('../middleware/auth');

// User sees their transactions
exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .populate('billId', 'amount');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Admin sees all transactions
exports.getAllTransactions = [auth, adminAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('userId', 'email')
      .populate('billId', 'amount');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}];



