import React, { useState } from "react";
import "./App.css";
import Login from "./components/Login.js";
import QuizApp from "./components/QuizApp.js";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
    const [userName, setUserName] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = (name) => {
        setUserName(name);
        setIsLoggedIn(true);
    };

    return (
        <Router>
            <div>
                <Routes>
                    {/* If logged in, redirect to the QuizApp page */}
                    <Route 
                        path="/login" 
                        element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} 
                    />
                    
                    {/* Main quiz app page that shows only if logged in */}
                    <Route 
                        path="/" 
                        element={isLoggedIn ? <QuizApp /> : <Navigate to="/login" />} 
                    />
                    
                </Routes>
            </div>
        </Router>
    );
}

export default App;


