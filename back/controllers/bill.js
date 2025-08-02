const Bill = require('../models/Bill');
const Transaction = require('../models/Transaction');
const bcrypt=require('bcryptjs');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

isValidCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Check length (Visa/MC: 16, Amex: 15, Tunisian CB: 16)
  if (![15, 16].includes(cleaned.length)) {
    return false;
  }

  // Luhn Algorithm
  let sum = 0;
  for (let i = 0; i < cleaned.length; i++) {
    let digit = parseInt(cleaned[i]);
    if ((cleaned.length - i) % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum %10 ===0;
};
// Pay a bill
exports.payBill = async (req, res) => {
 const { billId, cardNumber, cvv, saveCard, useSavedCard } = req.body;
  try {
    // Find the user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    
    
    

 
   
    if (user.status1 === "blocked") {
      console.log(' BLOCKED PAYMENT ATTEMPT');
      return res.status(403).json({ 
        success: false,
        msg: 'ACCOUNt Blocked: you cant pay until being activated' 
      });
    }

    

    // Find the bill
    const bill = await Bill.findOne({ _id: billId, userId: req.user.id });
    if (!bill) return res.status(404).json({ msg: 'Bill not found' });

    let last4; // Will store last 4 digits for transaction record

    if (!useSavedCard) {
      // If using manual entry, validate card number
      if (!isValidCardNumber(cardNumber)) {
        return res.status(400).json({ msg: 'Invalid card number' });
      }

      // Validate CVV if no saved CVV
      if (!user.savedCard || !user.savedCard.hashedCVV) {
        if (!/^\d{3}$/.test(cvv)) {
          return res.status(400).json({ msg: 'Invalid CVV. Must be 3 digits.' });
        }
      }

      // Extract last 4 digits
      last4 = cardNumber.slice(-4);

      // Save card for future if requested
      if (saveCard) {
        user.savedCard = {
          hashedCVV: await bcrypt.hash(cvv, 10),
          last4: last4 // store plain last 4 for user display
        };
        await user.save();
      }
    } else {
      // Using saved card: ensure user has savedCard
      if (!user.savedCard || !user.savedCard.last4 || !user.savedCard.hashedCVV) {
        return res.status(400).json({ msg: 'No saved card available for automatic payment' });
      }
      last4 = user.savedCard.last4;
    }

   
    bill.status = 'paid';
    await bill.save();

    // Create the transaction
    const transaction = new Transaction({
      userId: req.user.id,
      billId,
      amount: bill.amount,
      hashedCard: await bcrypt.hash(last4, 10) 
    });
    await transaction.save();


    bill.transactionId = transaction._id;
    await bill.save();
    


    res.json({ msg: 'Payment successful', transaction });

  } catch (err) {
    console.error('Error in payBill:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  } 

    
   
     
};

// Get user's bills
exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.user.id });
    res.json(bills);
  } catch (err) {
    res.status(500).send('Server error');
  }
};





//admin get all the bills 
exports.getAllbills =[auth,adminAuth, async(req,res) =>{
    try{
        const bills3 = await Bill.find({  }, '_id status provider  amount userId  dueDate');
          
        res.json(bills3);

 
     } catch(error){
        res.status(500).json({msg:'error in server'});
     }



}];
//add new bill by admin
exports.createNewbill=async(req,res) =>{

const {userId,provider,amount,dueDate}=req.body;
try{
  // Validate required fields
    if (!userId || !provider || !amount || !dueDate ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (isNaN(Number(amount))) {
      return res.status(400).json({ error: "Amount must be a number" });
    }

    if (isNaN(new Date(dueDate).getTime())) {
      return res.status(400).json({ error: "Invalid dueDate" });
    }

    

    const billData = {
      userId,
      provider,
      amount: Number(amount), 
      dueDate: new Date(dueDate), 
     
      createdAt: new Date() 
    };
   const bill = new Bill(billData);
    await bill.save();
    

    return res.status(201).json({
    message: "Bill added successfully",
    billId: bill._id
});


}



catch( err){
  console.error("Error in adding :", err);
  return res.status(500).json({ error: "Failed to create bill" });

}

};






