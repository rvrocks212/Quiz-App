import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = ({ onLogin }) => {
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        // Generate a random avatar URL
        setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`);
    }, []);

    const handleLogin = () => {
        if (userName.trim() !== "") {
            const storedLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

            // Check if username is already taken
            const userExists = storedLeaderboard.some(entry => entry.name === userName);
            if (userExists) {
                alert("Username already taken! Please choose a different name.");
                return;
            }

            const userAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;
            localStorage.setItem("username", userName);
            localStorage.setItem("avatar", userAvatar);
            onLogin(userName);
            navigate("/quiz");
        } else {
            alert("Please enter a valid name.");
        }
    };

    return (
        <div className="login-container">
            <h2>REGISTER</h2>
            <div className="avatar-container">
            <img src={avatar} alt="Avatar" className="avatar" />
            </div>
            <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <button className="start" onClick={handleLogin}>Start Quiz</button>
        </div>
    );
};

export default Login;




