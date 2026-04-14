import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Send, History, User } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
    return (
        <nav className="bottom-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <Home size={24} />
                <span>Home</span>
            </NavLink>
            <NavLink to="/send" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <div className="nav-action-btn">
                    <Send size={24} color="white" />
                </div>
                <span>Pay</span>
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <History size={24} />
                <span>History</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <User size={24} />
                <span>Profile</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
