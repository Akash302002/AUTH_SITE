const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cookieParser = require("cookie-parser");
const transporter = require("../config/mail");
const crypto = require('crypto')
const {EMAIL_VERIFY_TEMPLATE} = require('../config/email_Temp')



exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, msg: "fill all details" });

    const existingUser = await User.findOne({ email: email });

    if (existingUser)
      return res
        .status(400)
        .json({ success: false, msg: "user already signed up" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const savedUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // token generate //
    const payload = { id: savedUser._id, email: email };
    const token = await jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    console.log(payload);
    // send token in cookie

    res.cookie("Cookie", token, {
      httpOnly: true,
      secure:false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // send mail
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: `${savedUser.email}`,
      subject: "Registered Successfully",
       text: `Sending My First E-Mail to email ${savedUser.email}`,
      html: "<h1>USER REGISTERED SUCCESSFULLY</h1>",
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("mail info: ", info);
    

    return res
      .status(200)
      .json({ success: true, msg: "user signed up successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, msg: "fail to sign up", error: error.message });
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.json({ success: false, msg: "fill all details" }).status(400);

    const isUser = await User.findOne({ email: email });

    if (!isUser) return res.status(400).json({success: false, msg: "user not Registered" });

    // password match

    const isPassword = await bcrypt.compare(password, isUser.password);

    if (!isPassword)
      return res.json({ success: false, msg: "password Incorrect" });

    //token gen and send in res
    const payload = {
      id: isUser._id,
      email: isUser.email,
    };

    const token = await jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    console.log(payload);
    // send token in cookie

    res.cookie("Cookie", token, {
      httpOnly: true,
      expire: Date.now() + 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, msg: "user logged in successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, msg: "fail to log in", error: error.message });
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// logout

exports.logout = async (req, res) => {
  try {
    return res
      .clearCookie("Cookie")
      .status(200)
      .json({ success: true, msg: "logged out " });
  } catch (error) {
    return res
      .status(400)
      .json({ err: error.message,success: false, msg: "error in logging out" });
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// verify Email// where we will send otp by generating it first to user mail;

exports.sendVerifyOtp = async (req, res) => {

  try {

   const payload = req.userData

    const user = await User.findById(payload.id);

     if (!user) return res.json({ success: false, msg: "user not found" }).status(400);

    if(user.isVerified)
      return res.json({ success: false, msg:"user already verified"}).status(400);

    // generate OTP//6-digit
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: `${payload.email}`,
      subject: "OTP - VERIFICATION",
      // text: `Your OTP for email verification is ${otp}. It will expire in 6 hours.`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("mail info: ", info);
    console.log("EMAIL TEMP ", EMAIL_VERIFY_TEMPLATE);


    // save otp in DB

    user.otp = otp;
    user.otpExpiresAt = Date.now() + 6 * 60 * 60 * 1000;

    await user.save();

    return res
      .json({ success: true, msg: "otp sent successfully" })
      .status(200)

  } catch (error) {
    return res
      .status(400)
      .json({ success: false,err: error.message, msg: "error in sending  otp" });
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//enterOtp 

exports.verifyOtp=async (req,res)=>{
        
     try {
       const { otp } = req.body;

       const  payload  = req.userData

       const user = await User.findById(payload.id);

       if (!user) return res.json({ msg: "user not found" }).status(400);

       //
       if (otp === "" || otp !== user.otp)
         return res.json({ success: false, msg: "invalid otp" }).status(400);

       if(Date.now()>user.otpExpiresAt )
        return res.json({success: false,msg:"otp Expired"}).status(400);


       user.isVerified = true;
       user.otp = "";

       await user.save();

       return res.json({success:true,msg:"user verified successfully"}).status(200)

     } catch (error) {
          return res
            .status(400)
            .json({ success: false, msg: "error in verification" });
     }

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// isAuthenticated
exports.isAuthenticated=async(req,res)=>{
  try {
    return res.status(200).json({success:true,msg:"User is logged in"})
  } catch (error) {
    return res.status(400).json({success:false,msg:"not logged in" ,error:error.message})
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//send reset pass otp

exports.sendResetOtp=async(req,res)=>{
  try {
    const{email}=req.body

    if(!email)
      return res.status(400).json({ success: false, msg:"fill the email"})

    const isExistingUser = await User.findOne({email});

    if(!isExistingUser)
      return res.status(400).json({success: false,msg:"user not registered"})

    // gereate otp //set expiry too
    const otp = crypto.randomInt(100000,1000000).toString()

    isExistingUser.resetOtpExpiresAt=Date.now()+15*60*1000

     const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: `${email}`,
      subject: "OTP-VERIFICATION",
      text: `Your OTP for Password Reset is ${otp}. It will expire in 15 min.`,
      html: `
    <h1>Reset Password </h1>
    <p>Your OTP for reset password is <strong>${otp}</strong>.</p>
    <p>This OTP will expire in 15 min.</p>
    <p>If you did not request this, please ignore this email.</p>
  `,
    };
    const info = await transporter.sendMail(mailOptions)
    console.log("info",info)

   isExistingUser.resetOtp=otp

   await isExistingUser.save();

   return res.status(200).json({success: true,msg:"reset otp sent successfullt ",information:isExistingUser})

  } catch (error) {
    return res
      .status(400)
      .json({
        success: false,
        msg: "error in sending reset otp",
        error: error.message,
      });
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.resetPassword= async(req,res)=>{
  try {
    const {email,resetOtp,newPassword} = req.body

    if (!email || !resetOtp || !newPassword)
      return res.status(400).json({ success: false, msg: "fill all details" });

    const user = await User.findOne({email})

    if(!user)
      return res.status(400).json({ success: false, msg: "user not exist" });

    if (resetOtp === "" || user.resetOtp !== resetOtp)
      return res.status(400).json({ success: false,msg: "inavlid otp" });

    if(Date.now()>user.resetOtpExpiresAt)
          return res.status(400).json({ success: false,msg: "otp expired" });

    const newHashedPassword = await bcrypt.hash(newPassword,10);

    user.password=newHashedPassword
    user.resetOtp=""
    user.resetOtpExpiresAt=0
    
    await user.save()

 return res
   .status(200)
   .json({ success: true, msg: "password reset successfully", user: user });

  } catch (error) {
        return res
          .status(400)
          .json({
            success: false,
            msg: "error in reset password",
            error: error.message,
          });

  }
}