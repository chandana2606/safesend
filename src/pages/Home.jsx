import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import { Scan, Users, Building, ArrowRightLeft, Smartphone, FileText, Clock, TrendingUp, Eye, EyeOff, QrCode, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2 } from 'lucide-react';
import './Home.css';

const Home = () => {
    const { balance, jarBalance } = useAppContext();

    const [balanceVisible, setBalanceVisible] = useState(false);
    const [askingPin, setAskingPin] = useState(false);
    const [pinInput, setPinInput] = useState('');

    const handleCheckBalance = () => {
        if (balanceVisible) {
            setBalanceVisible(false);
        } else {
            setAskingPin(true);
        }
    };

    const verifyPin = () => {
        if (pinInput === '1234') {
            setBalanceVisible(true);
            setAskingPin(false);
            setPinInput('');
        } else {
            toast.error('Incorrect PIN. Try 1234.');
            setPinInput('');
        }
    };

    return (
        <div className="home-dashboard animate-slide-up">
            <TopBar userName="Demo User" />

            <div className="dashboard-content">
                {/* Balance Card with Privacy */}
                <div className="balance-card">
                    <div className="balance-header">
                        <p className="balance-label">Total Bank Balance</p>
                        <button className="eye-btn" onClick={handleCheckBalance}>
                            {balanceVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                            <span>{balanceVisible ? 'Hide' : 'Check Balance'}</span>
                        </button>
                    </div>

                    {askingPin ? (
                        <div className="pin-input-flyout">
                            <input
                                type="password"
                                placeholder="Enter 4-digit PIN"
                                maxLength={4}
                                value={pinInput}
                                onChange={(e) => setPinInput(e.target.value)}
                                autoFocus
                            />
                            <button className="btn-secondary" onClick={verifyPin}>Done</button>
                        </div>
                    ) : (
                        <h1 className="balance-amount">
                            {balanceVisible ? `₹${balance.toFixed(2)}` : '••••••••'}
                        </h1>
                    )}

                    <div className="balance-actions">
                        <button className="btn-secondary" onClick={() => toast.info('Adding money simulated')}>Add Money</button>
                        <Link to="/history" className="btn-secondary text-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                            <Clock size={16} /> History
                        </Link>
                    </div>
                </div>

                {/* Quick Actions Grid - Enforced Blue & White styling via CSS  */}
                <div className="quick-actions grid-6">
                    <Link to="/scan" className="action-item blue-white">
                        <div className="action-icon-wrapper">
                            <Scan size={24} color="var(--color-brand)" />
                        </div>
                        <span>Scan & Pay</span>
                    </Link>
                    <Link to="/send" className="action-item blue-white">
                        <div className="action-icon-wrapper">
                            <Users size={24} color="var(--color-brand)" />
                        </div>
                        <span>To Contact</span>
                    </Link>
                    <Link to="/send" state={{ mode: 'bank' }} className="action-item blue-white">
                        <div className="action-icon-wrapper">
                            <Building size={24} color="var(--color-brand)" />
                        </div>
                        <span>To Bank</span>
                    </Link>
                    <Link to="/transfer/self" className="action-item blue-white">
                        <div className="action-icon-wrapper">
                            <ArrowRightLeft size={24} color="var(--color-brand)" />
                        </div>
                        <span>Self Transfer</span>
                    </Link>
                    <Link to="/recharge" className="action-item blue-white">
                        <div className="action-icon-wrapper">
                            <Smartphone size={24} color="var(--color-brand)" />
                        </div>
                        <span>Recharge</span>
                    </Link>
                    <Link to="/bills" className="action-item blue-white">
                        <div className="action-icon-wrapper">
                            <FileText size={24} color="var(--color-brand)" />
                        </div>
                        <span>Pay Bills</span>
                    </Link>
                </div>

                {/* Jar Savings Highlight */}
                <Link to="/jar" className="jar-highlight card mt-4">
                    <div className="jar-visual">
                        <div className="jar-glass">
                            <div className="coin c1"></div>
                            <div className="coin c2"></div>
                            <div className="coin c3"></div>
                        </div>
                    </div>
                    <div className="jar-info">
                        <h3>Jar Savings</h3>
                        <p>Save money passively on every trade.</p>
                    </div>
                    <div className="jar-amount">
                        ₹{jarBalance.toFixed(0)}
                        <TrendingUp size={16} color="var(--color-success)" />
                    </div>
                </Link>

                {/* My QR Code - Receive Money Section */}
                <div className="receive-section card mt-4">
                    <div className="receive-header">
                        <div className="receive-title">
                            <QrCode size={20} color="var(--color-brand)" />
                            <h3>Receive Money</h3>
                        </div>
                    </div>

                    <div className="qr-container">
                        <div className="qr-frame">
                            <QRCodeSVG
                                value={`upi://pay?pa=demo@safesend&pn=${encodeURIComponent('Demo User')}&cu=INR`}
                                size={200}
                                level="H"
                                includeMargin={true}
                                className="qr-svg"
                            />
                        </div>
                        <div className="qr-instruction">
                            <p>Show this QR to receive money</p>
                            <span className="secure-badge">SafeSend Secure Transfer</span>
                        </div>
                    </div>

                    <div className="qr-actions-row">
                        <button className="qr-action-btn" onClick={() => toast.success('QR Downloaded (Simulated)')}>
                            <Download size={18} /> Download
                        </button>
                        <button className="qr-action-btn" onClick={() => toast.info('Sharing QR...')}>
                            <Share2 size={18} /> Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
