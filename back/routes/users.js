const express=require('express');
const router=express.Router();
const {auth,adminAuth} =require('../middleware/auth');
const {getAllUsers,updateUsersta} =require('../controllers/user');
//  routes to get the list of all the users
router.get('/',auth,adminAuth,getAllUsers);

// routes to update the list of users
router.put('/sta',auth,adminAuth,updateUsersta);

module.exports=router;