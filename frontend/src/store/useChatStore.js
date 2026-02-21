import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import {toast} from 'react-hot-toast';
import {useAuthStore} from './useAuthStore.js' 

export const useChatStore= create((set,get)=>({
    allContacts:[],
    chats:[],
    messages:[],
    activeTab: "chats",
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    isSoundEnabled:localStorage.getItem("isSoundEnabled")==="true"?true:false,
    toggleSound:()=>{
        localStorage.setItem("isSoundEnabled",!get().isSoundEnabled),//initially we are setting it to false
        set({isSoundEnabled:!get().isSoundEnabled})
    },
    setActiveTab:(tab)=>{
        set({activeTab:tab})
    },
    setSelectedUser:(user)=>{
        set({selectedUser:user})
    },
    getAllContacts:async()=>{
        set({isUsersLoading:true})
        try{
            const res=await axiosInstance.get("/messages/contacts")
            set({allContacts:res.data.filterUsers})
        }
        catch(error){
            toast.error(error.response?.data.message || "Failed to load contacts")
        }
        finally{
            set({isUsersLoading:false})
        }
    },
    getMyChatPartners:async()=>{
        set({isUsersLoading:true})
        try{
            const res=await axiosInstance.get("/messages/chats")
            set({chats:res.data})
        }
        catch(error){
            toast.error(error.response?.data.message || "Failed to load contacts")
        }
        finally{
            set({isUsersLoading:false})
        }
    },
    getMessagesByUserId:async(userId)=>{
        set({isMessagesLoading:true});
        try{
            const res=await axiosInstance.get(`/messages/${userId}`)
            set({messages:res.data.messages})
        }
        catch(error){
            toast.error(error.response?.data.message || "Failed to load messages")
        }
        finally{
            set({isMessagesLoading:false})
        }
    },
    sendMessage:async(data)=>{
        const {selectedUser,messages}=get();//getting the selected user and messages
        //we are seeing some time delay after sending message so for that-->
        const{authUser}=useAuthStore.getState();
        const tempId=`temp-${Date.now()}`
        const optimisticMessage={
            _id:tempId,
            senderId:authUser,
            receiverId:selectedUser._id,
            image:data.image,
            createdAt:new Date().toISOString(),
            isOptimistic:true,//flag to identify optimistic message (its optional)
        }
        //immidiately update the UI by adding message
        set({messages:[...messages,optimisticMessage]})
        try{
            const res=await axiosInstance.post(`/messages/send/${selectedUser._id}`,data);
            set({messages:messages.concat(res.data)})//we don't want to overwrite the message so latest messages will be added 
        }
        catch(error){
            set({messages:messages})//if error occurs we want to remove that optimistic message from the UI so we are setting the messages to previous messages
            toast.error(error.response?.data.message|| "failed to load image")
        }
    }
})) 