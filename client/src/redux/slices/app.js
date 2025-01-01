import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn:false,
  userData:{},
  isVerified:false
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    
    setLogin: (state, action) => {
      state.isLoggedIn = action.payload;
    }
    ,
    setUserData : (state,action)=>{
     state.userData=action.payload
    }
    ,
    setisVerified:(state,action)=>{
      console.log("Previous state.isVerified:", state.isVerified);
      console.log("Action payload:", action.payload);
      state.isVerified = action.payload;
      console.log("Updated state.isVerified:", state.isVerified);   
    }

  },

});

export const {  setLogin,setUserData,setisVerified } = authSlice.actions;
export default authSlice.reducer;
