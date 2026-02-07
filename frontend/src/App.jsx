import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import { useAuthStore } from './store/useAuthStore'
import PageLoader from './components/PageLoader'
import Toaster from 'react-hot-toast'

//install package for tailwind and daisyUI(it is used to reduce long styling performed in tailwind-->goto daisuUI and install package and all)

//npm i react-router  for performing routing and in main.jsx wrap the <App/> with BrowserRouter
//npm i axios
//npm i zustand (goto store folder ... then,useAuthStore.js)

const App = () => {

  console.log('🔄 App rendered');

  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);
  console.log('👤 authUser:', authUser);
  console.log('⏳ isCheckingAuth:', isCheckingAuth);
  console.log('✔️ Is user logged in?:', !!authUser);

  // Show loader while checking authentication
  if (isCheckingAuth) {
    return <PageLoader />;
  }

  // Main app UI
  return (
    <div className='min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden'>
      {/* DECORATORS - GRID BG & GLOW SHAPES (these will be in all routes)*/}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] -z-10" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

      <Routes>
        <Route path='/' element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false}/>
    </div>
  );
};

export default App;
