import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Loader2, XCircle, CheckCircle2, Zap, Lock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import './ConfirmPayment.css';

const ConfirmPayment = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { deductBalance, addBalance, balance, playVoice, voiceEnabled, playSuccessSound, security, addTransaction } = useAppContext();

    const [paymentState, setPaymentState] = useState('require_pin'); // require_pin -> processing -> success
    const [countdown, setCountdown] = useState(900); // 15 minutes hold
    const [timerIntervalId, setTimerIntervalId] = useState(null);
    const [pin, setPin] = useState('');

    useEffect(() => {
        if (!state) {
            toast.error('Invalid payment parameters');
            navigate('/');
        }

        // Stop any lingering voice feedback from previous screens
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }, [state, navigate]);

    useEffect(() => {
        if (paymentState === 'processing') {
            const id = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        handleFinalizePayment(id);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            setTimerIntervalId(id);
        }
        return () => {
            if (timerIntervalId) clearInterval(timerIntervalId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentState]);

    if (!state) return null;

    const { contact, amount, roundOffAmt, isRecharge } = state;
    const totalAmount = amount + roundOffAmt;

    const processBackendPayment = () => {
        addTransaction({ contact, amount, roundOffAmt, status: 'Completed' });
    };

    const handlePinSubmit = () => {
        if (totalAmount > balance) {
            toast.error('Insufficient Bank Balance');
            return;
        }
        if (pin === security.upiPin) {
            // Deduct instantly for record, then show app chooser
            if (deductBalance(totalAmount, roundOffAmt)) {
                toast.success("PIN Verified");
                setPaymentState('select_app');
            } else {
                toast.error('Payment failed: Insufficient balance');
            }
        } else {
            toast.error(`Incorrect PIN. ${security.biometricEnabled ? 'Try Biometric or check settings' : 'Try again'}`);
            setPin('');
        }
    };

    const handleFinalizePayment = (interval) => {
        if (interval) clearInterval(interval);
        if (timerIntervalId) clearInterval(timerIntervalId);

        // Already deducted at PIN, just show success!
        setPaymentState('success');
        playSuccessSound();
        processBackendPayment();
    };

    const handleUndo = () => {
        if (timerIntervalId) clearInterval(timerIntervalId);
        // Refund the escrow/jar money instantly
        addBalance(totalAmount, roundOffAmt);

        toast.info('Transaction Cancelled and funds refunded');
        navigate(-1);
    };

    const handleHome = () => {
        navigate('/');
    };

    const handleUpiIntent = (appScheme) => {
        const upiId = contact.phone.includes('@') ? contact.phone : `${contact.phone}@upi`;
        const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(contact.name)}&am=${totalAmount.toFixed(2)}&cu=INR`;

        // In a real app, you might use appScheme specifically if needed, 
        // but upi:// triggers the OS chooser.
        toast.info(`Redirecting to ${appScheme}...`);

        // Simulating the redirection
        setTimeout(() => {
            window.location.href = upiUri;

            // Wait for return (simulated)
            setTimeout(() => {
                if (isRecharge) {
                    setPaymentState('success');
                    playSuccessSound();
                    processBackendPayment();
                } else {
                    setPaymentState('processing');
                }
            }, 2000);
        }, 1000);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className={`confirm-page bg-${paymentState}`}>
            {paymentState === 'require_pin' && (
                <div className="pin-view animate-slide-up text-center flex-col" style={{ padding: '60px 20px', flex: 1, backgroundColor: '#f8f9fa' }}>
                    <header className="page-header transparent" style={{ position: 'absolute', top: 0, left: 0 }}>
                        <button className="icon-btn" onClick={() => navigate(-1)} style={{ color: 'var(--color-text-primary)' }}>
                            <ArrowLeft size={24} />
                        </button>
                    </header>
                    <Lock size={64} className="mx-auto mb-4" color="var(--color-brand)" />
                    <h2 className="mb-2" style={{ color: 'var(--color-text-primary)' }}>Enter UPI PIN</h2>
                    <p className="opacity-8 mb-4 text-secondary">To securely transfer ₹{totalAmount.toFixed(2)} to {contact.name}</p>

                    <div style={{ background: 'white', display: 'inline-block', borderRadius: '12px', padding: '10px 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <input
                            className="pin-big-input text-center"
                            type="password"
                            autoFocus
                            maxLength={4}
                            placeholder="••••"
                            value={pin}
                            onChange={e => setPin(e.target.value)}
                            style={{ fontSize: '40px', letterSpacing: '8px', border: 'none', outline: 'none', width: '160px', color: 'var(--color-text-primary)' }}
                        />
                    </div>
                    <button className="btn-primary full-width mt-4" style={{ marginTop: '32px' }} onClick={handlePinSubmit} disabled={pin.length < 4}>
                        Submit PIN to Confirm
                    </button>
                </div>
            )}

            {paymentState === 'select_app' && (
                <div className="app-chooser-view animate-slide-up" style={{ padding: '40px 20px', backgroundColor: '#fff', minHeight: '100vh' }}>
                    <div className="chooser-header text-center mb-8">
                        <Zap size={48} color="var(--color-brand)" className="mx-auto mb-4" />
                        <h2>Select Payment App</h2>
                        <p>Complete your payment using any UPI app</p>
                    </div>

                    <div className="upi-apps-list grid-2">
                        <div className="upi-app-card" onClick={() => handleUpiIntent('Google Pay')}>
                            <div className="app-icon gpay">G</div>
                            <span>Google Pay</span>
                        </div>
                        <div className="upi-app-card" onClick={() => handleUpiIntent('PhonePe')}>
                            <div className="app-icon phonepe">P</div>
                            <span>PhonePe</span>
                        </div>
                        <div className="upi-app-card" onClick={() => handleUpiIntent('Paytm')}>
                            <div className="app-icon paytm">Py</div>
                            <span>Paytm</span>
                        </div>
                        <div className="upi-app-card" onClick={() => handleUpiIntent('Other UPI')}>
                            <div className="app-icon other">U</div>
                            <span>Other UPI</span>
                        </div>
                    </div>

                    <div className="security-footer text-center mt-12">
                        <Lock size={16} className="inline mr-1" color="var(--color-text-muted)" />
                        <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Secure 128-bit Encrypted Payment</span>
                    </div>
                </div>
            )}

            {paymentState === 'processing' && (
                <div className="processing-view animate-fade-in" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                    <div className="safe-shield-header mb-4">
                        <ShieldCheck size={48} color="var(--color-success)" />
                        <h2 className="text-success">SafeSend Protected</h2>
                    </div>

                    <div className="payment-summary card mb-4">
                        <h3 className="text-center mb-4">Payment Summary</h3>
                        <div className="summary-row">
                            <span className="label">To</span>
                            <span className="value strong">{contact.name}</span>
                        </div>
                        <div className="summary-row">
                            <span className="label">Details</span>
                            <span className="value">{contact.phone}</span>
                        </div>

                        {roundOffAmt > 0 && (
                            <>
                                <hr className="divider thin" style={{ margin: '12px 0', opacity: 0.2 }} />
                                <div className="summary-row">
                                    <span className="label">Transfer Amount</span>
                                    <span className="value">₹{amount.toFixed(2)}</span>
                                </div>
                                <div className="summary-row" style={{ color: 'var(--color-brand)' }}>
                                    <span className="label">SafeSend Jar Saved</span>
                                    <span className="value">+ ₹{roundOffAmt.toFixed(2)}</span>
                                </div>
                            </>
                        )}

                        <hr className="divider thick" />
                        <div className="summary-row total-row">
                            <span className="label">Total Paying</span>
                            <span className="value grand-total">₹{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="undo-container card animate-slide-up" style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 className="mb-2" style={{ color: 'var(--color-text-primary)' }}>Security Hold</h3>
                        <div className="timer-circle" style={{ margin: '16px auto', border: '3px solid var(--color-warning)', color: 'var(--color-text-primary)', width: '80px', height: '80px', fontSize: '24px' }}>
                            <span>{formatTime(countdown)}</span>
                        </div>
                        <p className="text-secondary text-sm mb-4">
                            Money transfers automatically in 15 mins. Or confirm now.
                            <br />
                            <span style={{ fontSize: '12px', opacity: 0.8, display: 'block', marginTop: '8px' }}>
                                This is used to hold the payment for 15 minutes. Within 15 minutes we can cancel the payment, but after 15 minutes we can't cancel the payment.
                            </span>
                        </p>

                        <div className="flex-col gap-3">
                            <button className="btn-primary full-width" onClick={() => handleFinalizePayment()}>
                                <Zap size={20} className="mr-2" /> Confirm Payment
                            </button>
                            <button className="btn-secondary full-width" style={{ color: 'var(--color-danger)', border: '1px solid var(--color-danger)', background: 'transparent' }} onClick={handleUndo}>
                                <XCircle size={20} className="mr-2" /> Cancel Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {paymentState === 'success' && (
                <div className="success-view animate-slide-up" style={{ backgroundColor: '#fff', color: 'var(--color-text-primary)' }}>
                    <div className="success-receipt-card card text-center mb-8" style={{ border: 'none', background: '#fff' }}>
                        <div className="success-icon-wrap" style={{ margin: '0 auto 24px auto', display: 'inline-block' }}>
                            <CheckCircle2 size={80} color="var(--color-success)" />
                        </div>
                        <h2 className="success-title mb-1" style={{ color: 'var(--color-success)' }}>Payment Successful!</h2>
                        <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '12px 0' }}>₹{totalAmount.toFixed(2)}</h1>

                        <div className="receipt-details mt-6" style={{ textAlign: 'left', padding: '20px', background: '#f8f9fa', borderRadius: '16px' }}>
                            <div className="summary-row">
                                <span className="label">To</span>
                                <span className="value strong">{contact.name}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">VPA / Phone</span>
                                <span className="value">{contact.phone}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">Date & Time</span>
                                <span className="value">{new Date().toLocaleString()}</span>
                            </div>
                            <div className="summary-row">
                                <span className="label">Status</span>
                                <span className="value text-success">Completed</span>
                            </div>
                        </div>
                    </div>

                    <div className="success-actions full-width" style={{ padding: '0 20px' }}>
                        <button className="btn-primary full-width" onClick={handleHome}>Done</button>
                        <button className="btn-secondary full-width mt-3" onClick={() => toast.info('Receipt shared')}>Share Receipt</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConfirmPayment;
