import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home"
import User from './components/User'
import Friend from "./components/Friend";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Search from "./components/Search";

function App() {

  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/home" element={<Home />}/>
            <Route path="user/:id" element={<User/>}/>
            <Route path="/friends" element={<Friend/>}/>
            <Route path='/search_results/:name' element={<Search/>}/>
          </Routes>
        </Router>
    </div>
  )
}

export default App


