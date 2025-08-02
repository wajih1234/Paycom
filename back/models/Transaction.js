const mongoose = require('mongoose');
const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  billId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill' },
  amount: { type: Number, required: true },
  hashedCard: { type: String, required: true }, 
  timestamp: { type: Date, default: Date.now },
   receipt: Buffer,               // To store PDF file as binary data
  receiptContentType: String,   // To store MIME type (application/pdf)
});
module.exports = mongoose.model('Transaction', TransactionSchema);