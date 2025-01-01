//sign up route /signup
const {signUp,login,logout, sendVerifyOtp,verifyOtp, isAuthenticated, sendResetOtp, resetPassword} = require("../controller/Authen")
const express = require('express');
const  {userAuth}  = require("../middleware/Authorization");
const { getUserData } = require("../controller/userContro");
const router = express.Router();


router.post('/signup',signUp)
router.post('/login',login)
router.post('/logout',logout)
router.post('/sendVerifyOtp',userAuth,sendVerifyOtp)
router.post("/verifyOtp", userAuth, verifyOtp)
router.post('/isAuth',userAuth,isAuthenticated)
router.post('/sendResetOtp',sendResetOtp)
router.post("/resetPass", resetPassword);

router.get('/getUserData',userAuth,getUserData)

module.exports = router

