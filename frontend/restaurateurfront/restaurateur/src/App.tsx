
import { Link, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import TestPage from "./pages/TestPage"
import CreatePage from "./pages/CreatePage"
import EditPage from "./pages/EditPage"
import NotFoundPage from "./components/NotFoundPage"

import { ToastContainer } from 'react-toastify';
import CreateArticle from "./pages/Article/CreateArticle"
import CreateMenu from "./pages/Menu/CreateMenu"

import { useEffect, useState } from "react";
import "./App.css";
import { createZitadelAuth, ZitadelConfig } from "@zitadel/react";
// import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Callback from "./components/Callback";
import Account from "./pages/Account"

function App() {
  const config: ZitadelConfig = {
    authority: "https://instance1-el5q1i.zitadel.cloud/",
    client_id: "312751992336403117",
    redirect_uri: "http://localhost:5173/callback",
    post_logout_redirect_uri: "http://localhost:5173/"
  };

  const zitadel = createZitadelAuth(config);

  function login() {
    zitadel.authorize();
  }

  function signout() {
    zitadel.signout();
  }

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    zitadel.userManager.getUser().then((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
  }, [zitadel]);


  
  return (
    <div className="bg-white">
      <nav className="bg-gray-800">
        <div className="container mx-auto p-2">
          <Link to='/'><h2 className="text-white text-2xl font-bold">restaurateur front</h2></Link>
        </div>
      </nav>
      <div className="container mx-auto p-2 h-full">
      <Routes>

        <Route path="/" element={ <Login authenticated={authenticated} handleLogin={login} />}/>
            {/* nested */}

        <Route path="/callback" element={<Callback authenticated={authenticated} setAuth={setAuthenticated} handleLogout={signout} userManager={zitadel.userManager}/>}/>
        <Route path="/home" element={<HomePage/>}></Route>
        <Route path='/create-product' element={<CreatePage/>}></Route>
        <Route path='/create-article' element={<CreateArticle/>}></Route>
        <Route path='/create-menu' element={<CreateMenu/>}></Route>
        <Route path='/edit-product/:id' element={<EditPage/>}></Route>
        <Route path='/account' element={<Account authenticated={authenticated} setAuth={setAuthenticated} userManager={zitadel.userManager} />}></Route>
        <Route path='/test' element={<TestPage/>}></Route>
        <Route path="/404" element={<NotFoundPage/>} />
        <Route path="*" element={<NotFoundPage />} />
        
      </Routes>
      </div>
      <ToastContainer/>


    </div>
  )
}

export default App