import { useAuthStore } from "../store/useAuthStore";
function ChatPage() {
  const{isLoggedOut,logout}=useAuthStore();
  return (
    <div>Chat Page
      <button onClick={logout}  className="absolute top-0 right-0 px-4 py-2 bg-red-500 text-white">Logout</button>
    </div>
  )
}

export default ChatPage