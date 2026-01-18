import React from 'react'
import { useAuthStore } from '../store/useAuthStore'

function ChatPage() {
    const {numberOfUser,authUser,isLoggedIn,login}=useAuthStore();
    console.log(authUser,isLoggedIn,numberOfUser);
    
    
  return (
    <div>
        <h1 className='cursor-pointer'>Chat Page</h1>
        <button className='btn btn-primary' 
        onClick={login}>Click to check State Management</button>
    </div>
  )
}

export default ChatPage