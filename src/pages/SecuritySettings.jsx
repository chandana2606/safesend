import React, { useState } from 'react';
import { ArrowLeft, Lock, Fingerprint, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import './SecuritySettings.css';

const SecuritySettings = () => {
    const navigate = useNavigate();
    const { security, setSecurity } = useAppContext();
    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isChangingPin, setIsChangingPin] = useState(false);

    const handlePinChange = (e) => {
        e.preventDefault();

        if (currentPin !== security.upiPin) {
            toast.error('Current UPI PIN is incorrect');
            return;
        }

        if (newPin.length !== 4 && newPin.length !== 6) {
            toast.error('PIN must be 4 or 6 digits');
            return;
        }

        if (newPin !== confirmPin) {
            toast.error('New PIN and Confirm PIN do not match');
            return;
        }

        setSecurity(prev => ({
            ...prev,
            upiPin: newPin
        }));

        toast.success('UPI PIN changed successfully');
        setIsChangingPin(false);
        setCurrentPin('');
        setNewPin('');
        setConfirmPin('');
    };

    const toggleBiometric = () => {
        setSecurity(prev => ({
            ...prev,
            biometricEnabled: !prev.biometricEnabled
        }));
        toast.info(`Biometric lock ${!security.biometricEnabled ? 'enabled' : 'disabled'}`);
    };

    return (
        <div className="security-settings-page animate-fade-in">
            <header className="page-header">
                <button className="icon-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h2>Security & Privacy</h2>
            </header>

            <div className="security-content">
                <div className="security-status card">
                    <div className="status-header">
                        <ShieldCheck size={40} color="var(--color-success)" />
                        <div>
                            <h3>Your Account is Secure</h3>
                            <p>All transactions are Protected by SafeSend Escrow</p>
                        </div>
                    </div>
                </div>

                <div className="settings-section mt-4">
                    <div className="setting-card card" onClick={() => setIsChangingPin(!isChangingPin)}>
                        <div className="setting-icon-bg"><Lock size={20} color="var(--color-brand)" /></div>
                        <div className="setting-info">
                            <h4>Change UPI PIN</h4>
                            <p>Last changed {new Date().toLocaleDateString()}</p>
                        </div>
                        <div className={`chevron ${isChangingPin ? 'rotate' : ''}`}>›</div>
                    </div>

                    {isChangingPin && (
                        <form className="pin-change-form card animate-slide-up" onSubmit={handlePinChange}>
                            <div className="input-group">
                                <label>Current UPI PIN</label>
                                <input
                                    type="password"
                                    maxLength={6}
                                    value={currentPin}
                                    onChange={e => setCurrentPin(e.target.value)}
                                    placeholder="••••"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>New UPI PIN</label>
                                <input
                                    type="password"
                                    maxLength={6}
                                    value={newPin}
                                    onChange={e => setNewPin(e.target.value)}
                                    placeholder="••••"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Confirm New UPI PIN</label>
                                <input
                                    type="password"
                                    maxLength={6}
                                    value={confirmPin}
                                    onChange={e => setConfirmPin(e.target.value)}
                                    placeholder="••••"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary full-width">Update UPI PIN</button>
                        </form>
                    )}

                    <div className="setting-card card mt-3" onClick={toggleBiometric}>
                        <div className="setting-icon-bg"><Fingerprint size={20} color="var(--color-brand)" /></div>
                        <div className="setting-info">
                            <h4>Biometric Lock</h4>
                            <p>Unlock app with Fingerprint or Face ID</p>
                        </div>
                        <div className={`mock-toggle ${security.biometricEnabled ? 'active' : ''}`}>
                            <div className="toggle-thumb" />
                        </div>
                    </div>
                </div>

                <div className="privacy-tips mt-4">
                    <h3>Security Tips</h3>
                    <div className="tip-item card">
                        <p>Never share your UPI PIN or OTP with anyone, even if they claim to be from the bank.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecuritySettings;
