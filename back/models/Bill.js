const mongoose = require('mongoose');
const BillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  provider: { type: String, required: true }, 
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String,default:'unpaid'  } ,
   transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }
});
module.exports = mongoose.model('Bill', BillSchema);