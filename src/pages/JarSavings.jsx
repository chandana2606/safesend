import React from 'react';
import { ArrowLeft, PiggyBank, Settings, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import './JarSavings.css';

const JarSavings = () => {
    const navigate = useNavigate();
    const { jarBalance, withdrawFromJar, playVoice, playSuccessSound } = useAppContext();

    const currentSavings = jarBalance;
    const targetSavings = 2000;
    const progressPercent = Math.min((currentSavings / targetSavings) * 100, 100);

    const handleWithdraw = () => {
        if (jarBalance <= 0) {
            toast.error('No funds in Jar to withdraw');
            return;
        }

        const amountToWithdraw = jarBalance;
        if (withdrawFromJar(amountToWithdraw)) {
            toast.success(`₹${amountToWithdraw.toFixed(2)} transferred to Bank Account`);
            playSuccessSound();
            playVoice(`Success! You have transferred ${amountToWithdraw.toFixed(0)} rupees to your bank account.`);
        }
    };

    return (
        <div className="jar-page animate-fade-in">
            <header className="page-header transparent">
                <button className="icon-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <button className="icon-btn ml-auto">
                    <Settings size={20} />
                </button>
            </header>

            <div className="jar-header text-center">
                <div className="jar-visual-container">
                    <div className="jar-glass large">
                        <div className="coin c1"></div>
                        <div className="coin c2"></div>
                        <div className="coin c3"></div>
                        <div className="coin c4"></div>
                        <div className="coin c5"></div>
                    </div>
                </div>
                <h2>SafeSend Jar</h2>
                <p>Save seamlessly on every spend</p>
            </div>

            <div className="jar-content">
                <div className="jar-balance-card card">
                    <p>Total Gold Saved</p>
                    <h1>₹{currentSavings}</h1>
                    <div className="return-badge">
                        <TrendingUp size={16} /> +12.4% p.a. returns
                    </div>

                    <div className="progress-section">
                        <div className="progress-labels">
                            <span>Monthly Target</span>
                            <span>₹{targetSavings}</span>
                        </div>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="jar-actions">
                    <button className="btn-secondary full-width" onClick={() => toast.info('Adding money simulated')}>Add Money</button>
                    <button className="btn-primary full-width withdraw-btn" onClick={handleWithdraw}>Withdraw Gold</button>
                </div>

                <div className="transactions-mini card">
                    <h3>Recent Auto-Saves</h3>
                    <div className="t-row">
                        <span className="t-desc">Round off from Amazon.in</span>
                        <span className="t-amt">+₹8.00</span>
                    </div>
                    <div className="t-row">
                        <span className="t-desc">Round off from Zomato</span>
                        <span className="t-amt">+₹3.00</span>
                    </div>
                    <div className="t-row">
                        <span className="t-desc">Round off from Uber</span>
                        <span className="t-amt">+₹5.00</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JarSavings;
