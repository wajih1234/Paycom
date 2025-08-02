const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/auth');
const {getCurrentUser} =require('../controllers/user');
const { auth } = require('../middleware/auth');
const {forgotPassword} =require('../controllers/auth');
const {resetPassword} =require('../controllers/auth');
const {Updateemail}=require('../controllers/auth');
router.post('/signup', signup);
router.post('/login', login);
//get the logged in user
router.get('/user', auth, getCurrentUser);

//user forget the password
router.post('/forgot-password', forgotPassword)
// user rest his password
router.post('/reset-password', resetPassword);

//  user update 
router.put('/update-acc',auth,Updateemail);
module.exports = router;