import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home"
import User from './components/User'
import Friend from "./components/Friend";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Search from "./components/Search";
import ErrorPage from "./components/ErrorPage";
import Settings from "./components/Settings";
import FullPost from "./components/FullPost";

/**
 * App Component
 *  
 * @returns {JSX.Element} A React JSX element representing the App Component
*/
function App(): JSX.Element {

  return (
    <div className="App">
      {/* Contains routing for all routes in this app */}
        <Router basename={"/Fakebook-Frontend"}>
          <Routes>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/home" element={<Home />}/>
            <Route path="user/:id" element={<User/>}/>
            <Route path="/friends" element={<Friend/>}/>
            <Route path='/deleteUser' element={<Settings/>}/>
            <Route path='/search_results/:name' element={<Search/>}/>
            <Route path='/post/:id' element={<FullPost/>}/>
            <Route path='/error' element={<ErrorPage isApiErr={true}/>}/>
            <Route path="*" element={<ErrorPage isApiErr={false}/>}/>
            <Route path="/" element={<Login/>}/>
          </Routes>
        </Router>
    </div>
  )
}

export default App


