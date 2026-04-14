import React from 'react';
import { ArrowLeft, User, Shield, CreditCard, HelpCircle, LogOut, ChevronRight, Settings, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const { voiceEnabled, setVoiceEnabled, logout } = useAppContext();

    return (
        <div className="profile-page animate-fade-in">
            <header className="page-header transparent text-white">
                <button className="icon-btn dark" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h2>Profile</h2>
            </header>

            <div className="profile-header">
                <div className="profile-avatar-large">
                    <User size={48} color="var(--color-brand)" />
                </div>
                <h2>Demo User</h2>
                <p>+91 98765 43210</p>
                <div className="upi-id-box" onClick={() => {
                    navigator.clipboard.writeText('demo@safesend');
                    toast.success('UPI ID copied to clipboard!');
                }}>
                    <span>demo@safesend</span>
                    <Copy size={16} />
                </div>
                <div className="kyc-badge" style={{ marginTop: '8px' }}>
                    <Shield size={14} /> KYC Verified
                </div>
            </div>

            <div className="profile-content">
                <div className="settings-group card">
                    <h3>Payment Settings</h3>
                    <div className="setting-item" onClick={() => navigate('/profile/banks')}>
                        <div className="setting-icon-bg"><CreditCard size={20} color="var(--color-brand)" /></div>
                        <div className="setting-details">
                            <h4>Bank Accounts & Cards</h4>
                            <p>Manage your linked payment methods</p>
                        </div>
                        <ChevronRight size={20} color="var(--color-text-muted)" />
                    </div>
                    <div className="setting-item" onClick={() => {
                        const newState = !voiceEnabled;
                        setVoiceEnabled(newState);
                        toast.info(`Voice confirmation ${newState ? 'Enabled' : 'Disabled'}`);
                    }}>
                        <div className="setting-icon-bg"><HelpCircle size={20} color="var(--color-brand)" /></div>
                        <div className="setting-details">
                            <h4>Voice Confirmation</h4>
                            <p>{voiceEnabled ? 'Currently ON' : 'Currently OFF'}</p>
                        </div>
                        <div className={`mock-toggle ${voiceEnabled ? 'active' : ''}`}>
                            <div className="toggle-thumb" />
                        </div>
                    </div>
                    <div className="setting-item" onClick={() => navigate('/profile/security')}>
                        <div className="setting-icon-bg"><Shield size={20} color="var(--color-success)" /></div>
                        <div className="setting-details">
                            <h4>UPI PIN & Security</h4>
                            <p>Change PIN, Biometric lock</p>
                        </div>
                        <ChevronRight size={20} color="var(--color-text-muted)" />
                    </div>
                </div>

                <div className="settings-group card">
                    <h3>Other Settings</h3>
                    <div className="setting-item" onClick={() => toast.info('App Preferences coming soon')}>
                        <div className="setting-icon-bg"><Settings size={20} color="var(--color-text-secondary)" /></div>
                        <div className="setting-details">
                            <h4>App Preferences</h4>
                            <p>Language, Notifications, Theme</p>
                        </div>
                        <ChevronRight size={20} color="var(--color-text-muted)" />
                    </div>
                    <div className="setting-item" onClick={() => toast.info('Help & Support coming soon')}>
                        <div className="setting-icon-bg"><HelpCircle size={20} color="var(--color-info)" /></div>
                        <div className="setting-details">
                            <h4>Help & Support</h4>
                            <p>FAQs, Contact Customer Care</p>
                        </div>
                        <ChevronRight size={20} color="var(--color-text-muted)" />
                    </div>
                </div>

                <button className="logout-btn card" onClick={() => {
                    logout();
                    toast.info('Logged out successfully');
                    navigate('/');
                }}>
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>

                <p className="app-version">SafeSend Version 1.0.0</p>
            </div>
        </div>
    );
};

export default Profile;
