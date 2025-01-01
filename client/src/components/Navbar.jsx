import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios  from "axios";
import { setLogin } from "../redux/slices/app";
import { toast } from "react-toastify";

const Navbar = () => {

axios.defaults.withCredentials=true;  

const dispatch  = useDispatch()
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const navigate = useNavigate();
const isLog = useSelector((state)=>(state.auth.isLoggedIn))
const userData = useSelector((state) => state.auth.userData);
const isVerify = useSelector((state) => state.auth.isVerified);

async function logOutHandler(){

  try {
    const {data} = await axios.post(backendUrl+'/api/v1/logout')
    if(data.success){
      dispatch(setLogin(false))

      navigate('/')
      toast.success(data.msg)
      console.log(data)
    }
    else{
      console.log(data.error)
      toast(data.error)
    }
  } catch (error) {
     console.log(error.message);
     toast(error.message);
  }
}


const emailHandler = async ()=>{
  try {
    const { data } = await axios.post(backendUrl + "/api/v1/sendVerifyOtp",{withCredentials:true});
    if(data.success){
      navigate('/emailVerify')
      toast(data.msg)
    }
    else{
      toast(data.msg)
      console.log(data.error)
    }

  } catch (error) {
    console.error
    toast(error.message)
  }
}

console.log(userData)


  return (
    <div className="flex flex-row bg-slate-200   h-[70px] w-full ">
      <div className=" mt-2 p-2 h-[50px] mx-auto flex flex-row w-[1000px] justify-between items-center    ">
        <img src={assets.logo} alt="logo" height={10} />

        {isLog ? (
          <div className="w-100px h-30px  flex gap-2 px-4 py-2 rounded-lg">
            {userData.verified ? (
              <button
                onClick={logOutHandler}
                className="flex bg-black hover:bg-gray-800 active:scale-95 text-white items-center text-center justify-center   gap-1 rounded-full px-3 py-2   border-2 border-black"
              >
                Log Out
              </button>
            ) : (
              <div className="w-100px h-30px  flex gap-2 px-4 py-2 rounded-lg">
                <button
                  onClick={logOutHandler}
                  className="flex bg-black hover:bg-gray-800 active:scale-95 text-white items-center text-center justify-center   gap-1 rounded-full px-3 py-2   border-2 border-black"
                >
                  Log Out
                </button>
                <button
                  onClick={() => emailHandler()}
                  className="flex bg-black hover:bg-gray-800 active:scale-95 text-white items-center text-center justify-center   gap-1 rounded-full px-3 py-2   border-2 border-black"
                >
                  {" "}
                  Verify Email
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => {
              return navigate("/login");
            }}
            className="flex bg-black hover:bg-gray-800 active:scale-95 text-white items-center text-center justify-center   gap-1 rounded-full px-3 py-2   border-2 border-black"
          >
            Login
            <img src={assets.arrow_icon} alt="" />
          </button>
        )}
      </div>
    </div>
  );
}; 

export default Navbar;
