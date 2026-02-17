import React from 'react'
import { useChatStore } from '../store/useChatStore';
import { XIcon } from 'lucide-react';
import { useEffect } from 'react';

const ChatHeader = () => {
    const {selectedUser,setSelectedUser}=useChatStore();
    useEffect(()=>{
        const handleEscKey=(e)=>{
            if(e.key==="Escape"){
                setSelectedUser(null);
            }

            //cleanup function to remove the event listener when the component unmounts
            return ()=>window.removeEventListener("keydown",handleEscKey)
        }
        window.addEventListener("keydown",handleEscKey)
        return ()=>{
            window.removeEventListener("keydown",handleEscKey)
        }
    },[setSelectedUser])//jab jab selectedUser change hoga tab tab ye effect chalega taki hum escape key se chat close kar sake
  return (
    <div className='flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1 '>
        <div className='flex items-center space-x-3'>
            <div className='avatar online'>
                <div className='w-12 rounded-full'>
                    <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />

                </div>
            </div>
            <div >
                <h3 className='text-slate-200 font-medium '>{selectedUser.fullName}</h3>
                <p className='text-slate-400 text-sm'>Online</p>
            </div>
            
            
        </div>
        <button onClick={()=>setSelectedUser(null)} ><XIcon className='w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer'/></button>
    </div>
  )
}

export default ChatHeader