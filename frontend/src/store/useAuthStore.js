//Zustand--->(this is state management library ...like we have to send a variable a=10 from app to component or route page we send it as props a={a} then in that particular route page or component we receive it as props then inside functuon we use it as props.a which is so frustating....insteas of passing it to different components we can create it in a store called zustand store)
//we can use these states DIRECTLY in any component either children of App or grandChilren 

import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

//goto zustand webpage for overview of code ..how to write
// export const useAuthStore=create((set)=>({
//     numberOfUser:0,
//     authUser:{name:"john",age:25,_id:123},
//     isLoggedIn:false,
//     login:()=>{
//         console.log("we just logged in");
//         set({isLoggedIn:true})
//         set((state)=>({numberOfUser:state.numberOfUser+1}))
//     }
// }))
//this create function takes a function which return a object

//how to use-->
//const {authUser,isLoading,login}=useAuthStore(); that's it

//we are centralizing the values and using where ever we want directly


export const useAuthStore=create((set)=>({
    authUser:null,
    isCheckingAuth:true,
    checkAuth:async()=>{
        try{
            const res=await axiosInstance.get('/auth/check');//this is equal to http://localhost:3000/api/auth/check
            set({authUser:res.data});
        }catch(error){
            console.error("error in authCheck:",error);
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})//either we succeed in try block or fail in catch -->make isCheckingAuth :false
        }
    }
}))