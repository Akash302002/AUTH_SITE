import React from 'react'
import { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {  toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux'
import { setLogin } from '../redux/slices/app'

const backendUrl = import.meta.env.VITE_BACKEND_URL

const Login = () => {
 axios.defaults.withCredentials = true;
 const islogin = useSelector((state) => state.auth.isLoggedIn);
 const dispatch = useDispatch();


console.log(backendUrl)

  const navigate = useNavigate()
  const [state, setState] = useState('Sign Up')
  const [form, setForm] = useState({name:"",email:"",password:""})

  function handleChange(e){
     setForm((form)=>{
      return {...form,
        [e.target.name]:e.target.value
      }
     })
  
    
  }

 

 async function handleSubmit(e){
e.preventDefault()
try {
  if (state === "Sign Up") {
    console.log(form);

    const resp = await axios.post(backendUrl + "/api/v1/signup", form);
    console.log("response", resp); // print

    if (resp.data.success) {
      dispatch(setLogin(true));
      navigate("/");
      toast(resp.data.msg);
    } else {
      toast.error(resp.data.msg);
    }

  } else {
    const res = await axios.post(backendUrl + "/api/v1/login", {email:form.email,password:form.password});
    console.log(res);

    if (res.data.success) {
      navigate("/");
      toast(res.data.msg);
      dispatch(setLogin(true));

    } else {
      toast(res.data.msg);
    }
  }


} catch (error) {
  console.log(error.response?.data || error.message);
  toast.error(error.response?.data?.msg || "An error occurred");
}
 }




return (
  <div className="flex  items-center justify-center min-h-screen px-6   bg-gradient-to-br from-blue-200 to-purple-400">
    <img
      src={assets.logo}
      alt=""
      className="absolute left-5px sm: left-20 top-5 w-28 sm:w-32 cursor-pointer"
    />

    <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
      <h2 className="text-3xl font-semibold text-white text-center mb-3">
        {state === "Sign Up" ? "Create Account" : "Login"}
      </h2>

      <p className="text-center text-sm mb-6">
        {state === "Sign Up" ? "Create your account" : "Login to your account!"}
      </p>

      {state === "Sign Up" ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[# 333A5C]">
            <img src={assets.person_icon} alt="" />
            <input
              className="bg-transparent  outline-none"
              type="text"
              placeholder="Full Name "
              required
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[# 333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              className="bg-transparent outline-none"
              type="email"
              placeholder=" Enter Email "
              required
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[# 333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              className="bg-transparent outline-none"
              type="password"
              placeholder="Enter Password"
              required
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button
            className="w-full py-2.5 rounded-full bg-gradient-to-r
from-indigo-500 to-indigo-900 text-white font-medium"
          >
            {state}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[# 333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              className="bg-transparent outline-none"
              type="email"
              placeholder=" Enter Email "
              required
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[# 333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              className="bg-transparent outline-none"
              type="password"
              placeholder="Enter Password"
              required
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <p
            onClick={() => navigate("/reset")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot password?
          </p>
          <button
            className="w-full py-2.5 rounded-full bg-gradient-to-r
from-indigo-500 to-indigo-900 text-white font-medium"
          >
            {state}
          </button>
        </form>
      )}
      {state === "Sign Up" ? (
        <p className="text-gray-400 text-center text-xs mt-4">
          Already have an account?{" "}
          <span
            onClick={() => {
              setState((state) => "Log In");
            }}
            className="text-blue-400 cursor-pointer underline"
          >
            Login here
          </span>
        </p>
      ) : (
        <p className="text-gray-400 text-center text-xs mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => {
              setState((state) => "Sign Up");
            }}
            className="text-blue-400 cursor-pointer underline"
          >
            Sign up
          </span>
        </p>
      )}
    </div>
  </div>
);}
export default Login