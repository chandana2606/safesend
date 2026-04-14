import React, { useState } from 'react';
import { Smartphone, ShieldCheck, Landmark, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login, banks, security } = useAppContext();
    const [step, setStep] = useState(1); // 1: Phone, 2: Bank, 3: PIN

    const [phone, setPhone] = useState('');
    const [selectedBank, setSelectedBank] = useState(null);
    const [pin, setPin] = useState('');

    const handlePhoneSubmit = (e) => {
        e.preventDefault();
        if (phone.length === 10) {
            setStep(2);
        } else {
            toast.error('Enter a valid 10-digit phone number');
        }
    };

    const handleBankSelect = (bank) => {
        setSelectedBank(bank);
        setStep(3);
    };

    const handlePinSubmit = (e) => {
        e.preventDefault();
        if (pin === security.upiPin) {
            toast.success('Login Successful!');
            login({ phone, bank: selectedBank });
            navigate('/');
        } else {
            toast.error('Incorrect UPI PIN');
            setPin('');
        }
    };

    return (
        <div className="login-page animate-fade-in">
            <div className="login-header text-center">
                <div className="brand-logo">
                    <ShieldCheck size={48} color="white" />
                </div>
                <h1>SafeSend</h1>
                <p>Secure. Fast. Simple.</p>
            </div>

            <div className="login-card-container">
                {step === 1 && (
                    <form className="login-step card animate-slide-up" onSubmit={handlePhoneSubmit}>
                        <div className="step-badge">Step 1/3</div>
                        <h2>Enter Phone Number</h2>
                        <p>Verify your linked mobile number to continue</p>

                        <div className="input-group-auth">
                            <Smartphone size={20} />
                            <span>+91</span>
                            <input
                                type="tel"
                                placeholder="9876543210"
                                maxLength={10}
                                value={phone}
                                onChange={e => {
                                    const val = e.target.value;
                                    if (val.length <= 10) setPhone(val);
                                }}
                                autoFocus
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary full-width mt-6">
                            Continue <ChevronRight size={18} />
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <div className="login-step card animate-slide-up">
                        <div className="step-badge">Step 2/3</div>
                        <h2>Select Bank Account</h2>
                        <p>Choose the bank linked with {phone}</p>

                        <div className="banks-list-login mt-4">
                            {banks.map(bank => (
                                <div
                                    key={bank.id}
                                    className="bank-item-login"
                                    onClick={() => handleBankSelect(bank)}
                                >
                                    <div className="bank-icon-sm">{bank.icon || <Landmark />}</div>
                                    <div className="bank-name-auth">
                                        <h4>{bank.name}</h4>
                                        <span>{bank.accountNo}</span>
                                    </div>
                                    <ChevronRight size={18} color="var(--color-text-muted)" />
                                </div>
                            ))}
                        </div>
                        <button className="btn-secondary full-width mt-4" onClick={() => setStep(1)}>Back</button>
                    </div>
                )}

                {step === 3 && (
                    <form className="login-step card animate-slide-up" onSubmit={handlePinSubmit}>
                        <div className="step-badge">Step 3/3</div>
                        <h2>Enter UPI PIN</h2>
                        <p>Authenticating for {selectedBank?.name}</p>

                        <div className="pin-input-group mt-6">
                            <input
                                type="password"
                                placeholder="••••"
                                maxLength={6}
                                value={pin}
                                onChange={e => setPin(e.target.value)}
                                autoFocus
                                required
                            />
                            <div className="pin-hint">Enter your 4 or 6 digit secure PIN</div>
                        </div>

                        <button type="submit" className="btn-primary full-width mt-6">
                            Login Securely <CheckCircle2 size={18} />
                        </button>
                        <button type="button" className="btn-secondary full-width mt-4" onClick={() => setStep(2)}>Back</button>
                    </form>
                )}
            </div>

            <div className="login-footer text-center">
                <p>New to SafeSend? <span>Create Account</span></p>
            </div>
        </div>
    );
};

export default Login;
