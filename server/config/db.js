const mongoose = require('mongoose');
require('dotenv').config();

const db =()=>{
    mongoose.connect(process.env.MONGODBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(()=>{console.log("successfully connected with MONGODB DataBase")})
    .catch((error)=>{console.log("error in connecting with DB",error)})
}

module.exports=db