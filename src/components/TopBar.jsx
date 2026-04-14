import React from 'react';
import { Bell, UserCircle } from 'lucide-react';
import './TopBar.css';

const TopBar = ({ userName = "User" }) => {
    return (
        <header className="top-bar">
            <div className="user-info">
                <UserCircle size={40} className="profile-icon" color="var(--color-brand)" />
                <div className="greeting">
                    <span className="welcome-text">Welcome back,</span>
                    <h2 className="user-name">{userName}</h2>
                </div>
            </div>
            <button className="notification-btn">
                <Bell size={24} color="var(--color-text-secondary)" />
                <span className="badge">2</span>
            </button>
        </header>
    );
};

export default TopBar;
