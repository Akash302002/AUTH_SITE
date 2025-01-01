const express = require('express')
const app = express();
const db = require('./config/db')
const router = require('./routes/Auth')
require('dotenv').config()
const cors = require('cors');
const cookieParser = require('cookie-parser')
app.use(express.json())

app.use(cookieParser());


const allowedOrigins = ["http://localhost:5173"]
app.use(cors({ credentials: true, origin : allowedOrigins }));

app.use("/api/v1", router);


 app.get('/',(req,res)=>{
    res.send("hello server")
 })

app.listen(process.env.PORT || 4000,()=>{console.log("server is started at port 4000")});
db();