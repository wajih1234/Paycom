const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,  
    lowercase: true, 
    trim: true      
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    default: 'user', 
  
  },
  status1: { type: String, default: 'active' },
  savedCard: {
  type: {
   last4: String, 
   hashedCVV: String
  },
  default: null  
},
resetPasswordToken: String,
resetPasswordExpires: Date,
});



module.exports = mongoose.model('User', UserSchema);