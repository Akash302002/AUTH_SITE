const User  = require('../models/User')

exports.getUserData = async(req,res)=>{
    try {
       const payload = req.userData
       
       const user = await User.findById(payload.id)

       if(!user)
        return res.status(400).json({ msg: "user not exist", success: false });

       return res.status(200).json({ success: true,msg: "user data fetched successfully" ,
        userInfo:{
         email:user.email,
         verified:user.isVerified,
         name:user.name
        }
       });
       
    } catch (error) {
        return res.status(400).json({success: false,msg:"error in fetching user details"})
    }
}