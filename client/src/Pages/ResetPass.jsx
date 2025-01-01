import React from 'react'
import { assets } from '../assets/assets'



const ResetPass = () => {
  return (
    <div className="bg-slate-950 p-10 flex-col shadow-lg flex justify-center items-center  text-indigo-300 text-sm min-h-screen w-screen">
      <div className="mb-4 flex  items-center justify-center gap-3 w-full px-5 py-2.5 rounded-full bg-[# 333A5C]">
        <img src={assets.mail_icon} alt="" />
        <input
          className="bg-transparent outline-none"
          type="email"
          placeholder=" Enter Email "
          required
        />
      </div>
      <button
        className="w-[300px] py-2.5 rounded-full bg-gradient-to-r
from-indigo-500 to-indigo-900 text-white font-medium"
      >
        Send OTP
      </button>
    </div>
  );
}

export default ResetPass