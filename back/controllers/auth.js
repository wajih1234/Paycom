const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendResetEmail = require('./emailService');
const crypto = require('crypto');

// Register user
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  //
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ msg: 'Invalid email format' });
  }
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    if(password.length <7)  return res.status(400).json({ msg: 'password  must be at least 7 characters ' });

    user = new User({ name, email, password: await bcrypt.hash(password, 10),role: 'user' });
    await user.save();
    

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token,
        msg:'registration succeeded'
       });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'no user with this email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'password incorrect' });
     console.log('everything ok');

    const payload = { user: { id: user.id, role: user.role, name: user.name ,email:user.email} };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token,
        role: user.role,
        name: user.name

       });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.forgotPassword = async (req, res) =>{

  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    console.log('Generated reset token:', resetToken);
 
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    const emailSent = await sendResetEmail(user.email, resetLink);

    if (!emailSent) {
      return res.status(500).json({ msg: 'Failed to send email' });
    }

    res.json({ msg: 'Password reset email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};
exports.resetPassword = async (req, res) =>{
 const { token, password } = req.body; 

  try {
    
    const user = await User.findOne({ 
      resetPasswordToken: token, 
      resetPasswordExpires: { $gt: Date.now() } 
    });
    console.log('Token being sent:', token);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired reset token' });
    }

   
    user.password = await bcrypt.hash(password, 10);

   
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ msg: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }

};
// updating the email and the password 
exports.Updateemail=async(req,res)=>{
  const {email,currentpassword,newpassword}=req.body;
  try{
     const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (user.status1 === "blocked") {
      return res.status(403).json({ msg: 'The user cannot pay until activated' });}
    if(user.password !== currentpassword){ res.json({msg:'the password is incorrect'});}
      
      user.email=email;
      user.password=await bcrypt.hash(newpassword, 10);
      await user.save();
    

    
  }catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }

};