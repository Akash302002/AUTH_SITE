exports.userAuth = async(req,res,next)=>{
    const jwt = require('jsonwebtoken')
    
    try {

      const token = req.cookies.Cookie;

      if (!token)
        return res
          .status(400)
          .json({ success: false, msg: "not authenticated" });

      //verify
      const payload = await jwt.verify(token, process.env.JWT_KEY);

      if (!payload) 
        return res.json({ msg: "token invalid" }).status(400);

      console.log("payload ", payload)
      
      req.userData = payload // adding payload in req ibj in userData prprty

      next()

    } catch (error) {
       return res.json({msg:"error in authorization",error:error.message}).status(400)   
    }


}