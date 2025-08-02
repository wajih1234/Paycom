const express=require('express');
const router=express.Router();
const authRoutes = require('./auth');
const billRoutes = require('./bills');
const transactionRoutes = require('./transactions');
const userRoutes = require('./users');



router.use('/auth', authRoutes);
router.use('/bills', billRoutes);
router.use('/transactions', transactionRoutes); 
router.use('/users', userRoutes);

module.exports=router;
