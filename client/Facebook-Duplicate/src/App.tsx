import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

function App() {
  const [user, setUser] = React.useState({});

  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/home" element={<Home />}/>
          </Routes>
        </Router>
    </div>
  )
}

export default App


//TODO: make sure user can only see login/signup page and is redirected otherwise
