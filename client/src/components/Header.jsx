import React, { useEffect,useState } from 'react'
import {assets} from '../assets/assets'
import { useDispatch, useSelector } from 'react-redux';
const backendUrl = import.meta.env.VITE_BACKEND_URL
import axios from 'axios'
import { setUserData,setLogin, setisVerified } from '../redux/slices/app';


const Header = () => {
 
  const userData = useSelector((state)=>state.auth.userData)
  const dispatch = useDispatch();

 
  const isVerified = useSelector((state) => state.auth.isVerified);

  const isLogIn = useSelector((state) => state.auth.isLoggedIn);

  console.log("initaial login",isLogIn)
   console.log("initial verifeid", isVerified);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/v1/getUserData`, {
          withCredentials: true, // Ensure credentials are included
        });

        if (data.success) {
          dispatch(setUserData(data.userInfo)); // Save user data in Redux
          dispatch(setLogin(true)); // Mark user as logged in
          dispatch(setisVerified(data.userInfo.verified));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        dispatch(setLogin(false)); // Handle logout case
      } 
    };

    fetchData();
  }, []); // Runs on mount


  

  console.log("final login",isLogIn)
  console.log("final verifeid",isVerified)


  return (
    <div className="flex flex-col justify-center items-center bg-slate-800 h-screen w-screen text-white">
      <img
        src={assets.header_img}
        alt=""
        className="w-36 h-36 rounded-full mb-6"
      />

      <h1
        className="flex items-center gap-2 text-xl sm: text-3xl
           font-medium mb-2"
      >
        Hey,

        {isLogIn && userData ? (
          <h1 className="text-blue-700">{userData.name}</h1>
        ) : (
          "Developer"
        )}
        <img className="w-8 aspect-square" src={assets.hand_wave} alt="" />
      </h1>

      <h2 className="text-3xl sm:text-5x font-semibold mb-4">
        Welcome to our app
      </h2>

      <p className="mb-8 max-w-md">
        Let's start with a quick product tour and we will have you up and
        running in no time!
      </p>

      <button className="border text-white  border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 hover:text-black transition-all">
        Get Started
      </button>
    </div>
  );
}

export default Header