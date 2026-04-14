import React, { useState } from 'react';
import { ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import './SelfTransfer.css';

const SelfTransfer = () => {
    const navigate = useNavigate();
    const { balance } = useAppContext();

    const [selectedBank, setSelectedBank] = useState('');
    const [amount, setAmount] = useState('');
    const [step, setStep] = useState(1); // 1: input, 2: success

    const banks = [
        { id: 'hdfc', name: 'HDFC Bank', acnt: '•••• 1234' },
        { id: 'sbi', name: 'State Bank of India', acnt: '•••• 9876' },
    ];

    const handleTransfer = () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast.error('Enter a valid amount');
            return;
        }
        if (parseFloat(amount) > balance) {
            toast.error(`Insufficient Bank Balance (Avl: ₹${balance.toFixed(2)})`);
            return;
        }

        const bankName = banks.find(b => b.id === selectedBank)?.name;
        navigate('/confirm', {
            state: {
                contact: { name: 'Self Transfer', phone: bankName },
                amount: parseFloat(amount),
                roundOffAmt: 0,
                isRecharge: false,
                isInstant: true
            }
        });
    };

    return (
        <div className="self-transfer-page animate-fade-in">
            <header className="page-header transparent">
                <button className="icon-btn" onClick={() => step === 1 ? navigate(-1) : navigate('/')}>
                    <ArrowLeft size={24} />
                </button>
                <h2>Transfer to Self</h2>
            </header>

            {step === 1 && (
                <div className="transfer-content">
                    <div className="card bank-selector">
                        <h3>Transfer To</h3>
                        {banks.map(b => (
                            <label key={b.id} className={`bank-option ${selectedBank === b.id ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="bank"
                                    value={b.id}
                                    onChange={() => setSelectedBank(b.id)}
                                />
                                <Building2 size={24} color="var(--color-brand)" className="bank-icn" />
                                <div className="b-details">
                                    <h4>{b.name}</h4>
                                    <p>{b.acnt}</p>
                                </div>
                            </label>
                        ))}
                    </div>

                    {selectedBank && (
                        <div className="amount-input card animate-slide-up mt-4 text-center">
                            <h3>Amount to transfer</h3>
                            <div className="amt-wrap mt-4">
                                <span className="currency">₹</span>
                                <input
                                    type="number"
                                    autoFocus
                                    placeholder="0"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                />
                            </div>

                            <button
                                className="btn-primary full-width mt-4"
                                onClick={handleTransfer}
                                disabled={!amount}
                            >
                                Transfer Now
                            </button>
                        </div>
                    )}
                </div>
            )}

            {step === 2 && (
                <div className="success-view animate-slide-up">
                    <div className="success-icon-wrap">
                        <CheckCircle2 size={100} color="var(--color-success)" />
                    </div>
                    <h2 className="text-white mb-2">Transfer Successful</h2>
                    <p className="text-white opacity-8">₹{amount} moved successfully to your {banks.find(b => b.id === selectedBank)?.name} account.</p>

                    <button className="btn-white mt-4" onClick={() => navigate('/')}>Done</button>
                </div>
            )}
        </div>
    );
};

export default SelfTransfer;
