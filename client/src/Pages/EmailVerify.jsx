import React, { useRef } from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL
import { setisVerified } from "../redux/slices/app";
import { useDispatch, useSelector } from "react-redux";


const EmailVerify = () => {
 
 const length = 6 
  const navigate = useNavigate();
  const dispatch =  useDispatch()
  const isLoggedIn = useSelector((state)=>(state.auth.isLoggedIn))
  const isVerified = useSelector((state) =>(state.auth.isVerified));

  const userData = useSelector((state)=>(state.auth.userData))
  
 console.log(isLoggedIn, isVerified);

  useEffect(() => {
     if ( userData.verified) {
       navigate("/");
     }
  },[]);

  const [OTP, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  function handleChange(value, index){

    if (isNaN(value)) return; // Only allow numeric input

    const newOtp = [...OTP];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically move to the next input field
    if (value !== "" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && OTP[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  async function handleSubmit ()  {
    const otp = OTP.join("");
    // Pass the OTP value to the parent component
    
    try {
      const {data} = await axios.post(backendUrl+'/api/v1/verifyOtp',{otp},{withCredentials:true})
      console.log(data)
      if(data.success){
       dispatch(setisVerified(true));
       toast.success(data.msg);
       navigate("/");
      }
      else
      {
        toast(data.msg)
      }
    } catch (error) {
      console.log(error.message)
      toast(error.message)
    }

  };

 console.log(isLoggedIn,isVerified)
  
  return (
    <div className="flex flex-col items-center bg-black h-screen justify-center ">
      <h1 className="text-blue-400 mb-3 text-3xl ">Enter The OTP</h1>
      <div className="flex gap-2">
        {OTP.map((data, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength="1"
            value={data}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleBackspace(e, index)}
            className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </div>
  );
};

export default EmailVerify;

// Example usage:
// <OTPComponent length={6} onSubmit={(otp) => console.log("Entered OTP:", otp)} />
