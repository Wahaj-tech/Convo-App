//Zustand--->(this is state management library ...like we have to send a variable a=10 from app to component or route page we send it as props a={a} then in that particular route page or component we receive it as props then inside functuon we use it as props.a which is so frustating....insteas of passing it to different components we can create it in a store called zustand store)
//we can use these states DIRECTLY in any component either children of App or grandChilren 

import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

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
    isSigningUp:false,
    isLoggingIn:false,
    isLoggedOut:false,
    checkAuth:async()=>{
        try{
            const res=await axiosInstance.get('/auth/check');//this is equal to http://localhost:3000/api/auth/check
            if (res.data && res.data._id) { // or whatever field identifies a valid user
                set({ authUser: res.data });
            } else {
                set({ authUser: null });
            }
        }catch(error){
            console.error("error in authCheck:",error);
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})//either we succeed in try block or fail in catch -->make isCheckingAuth :false
        }
    },
    signup:async(data)=>{
        set({isSigningUp:true})
        try{
            const res=await axiosInstance.post('/auth/signup',data)
            set({authUser:res.data})
            //instead of flash we are using react hot toast for showing success and error messages
            //npm i react-hot-toast
            toast.success("SIgnUp successful")
        }catch(error){
            console.error("error in signup:",error);
            toast.error(error.response?.data.message||"Signup failed");
        }   
        finally{
            set({isSigningUp:false})
        }
    },
    login:async(data)=>{
        set({isLoggingIn:true})
        try{
            const res=await axiosInstance.post('/auth/login',data);
            set({authUser:res.data})
            toast.success("Login successful")
        }catch(error){
            console.error("error in login:",error);
            toast.error(error.response?.data.message||"Login failed");
        }finally{
            set({isLoggingIn:false})
        }
    },
    logout:async()=>{
        set({isLoggedOut:true})
        try{
            const res=await axiosInstance.post('/auth/logout');//backend seh {"message":"Logged Out Successfully"} yeh aa rha h(can go and check in network in browser devtools and clicking on Fetch/XHR)
            set({authUser:null})
            toast.success(res.data.message)
        }
        catch(error){
            toast.error(error.response?.data.message||"Logout failed");
        }finally{
            set({isLoggedOut:false})
        }
    }, 
    updateProfile:async(data)=>{
        try{
            const res=await axiosInstance.put('/auth/update-profile',data);
            set({authUser:res.data})
            toast.success("Profile Updated Successfully");
        }catch(error){
            toast.error(error.response?.data.message||"Failed to update profile");
        }
    },

    }))



 