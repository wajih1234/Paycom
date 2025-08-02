const { auth,adminAuth } = require('../middleware/auth');
const User = require('../models/User');

exports.getAllUsers =[auth,adminAuth, async(req,res) =>{
    try{
        const users = await User.find({}, 'name email  status1 ');
        res.json(users);

 
     } catch(error){
        res.status(500).json({msg:'error in server'});
     }



}];





exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};




//update the list of users(activate or block)
exports.updateUsersta= [auth,adminAuth,async(req,res) =>
    {
      const { userId, status1 } = req.body;

      try{
        const user =  await  User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        user.status1=status1;
         user.save();
          res.json({ msg: `User updated to status1: ${status1}` });

        

           
      } catch(err){
       console.error(err); 
       res.status(500).json({ msg: err.message }); 
      }
 }];
