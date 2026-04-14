import React, { useState } from 'react';
import { ArrowLeft, Search, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MobileRecharge.css';

const MOCK_PLANS = [
    { id: 1, price: 299, validity: '28 Days', data: '1.5GB/day' },
    { id: 2, price: 479, validity: '56 Days', data: '1.5GB/day' },
    { id: 3, price: 719, validity: '84 Days', data: '2GB/day' },
    { id: 4, price: 149, validity: '20 Days', data: '1GB/day' },
];

const MobileRecharge = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [operator, setOperator] = useState(null); // 'airtel', 'jio', 'vi', 'bsnl'

    const handlePhoneChange = (e) => {
        const val = e.target.value;
        setPhone(val);
        if (val.length === 10) {
            if (val.startsWith('98')) setOperator('Airtel');
            else if (val.startsWith('88')) setOperator('Jio');
            else if (val.startsWith('77')) setOperator('Vi');
            else setOperator('BSNL');
        } else {
            setOperator(null);
        }
    };

    const handlePlanSelect = (plan) => {
        navigate('/confirm', {
            state: {
                contact: { name: `${operator} Recharge`, phone },
                amount: plan.price,
                roundOffAmt: 0,
                isRecharge: true,
                isInstant: true
            }
        });
    };

    return (
        <div className="recharge-page animate-fade-in">
            <header className="page-header">
                <button className="icon-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h2>Mobile Recharge</h2>
            </header>

            <div className="recharge-content">
                <div className="search-bar card mt-4">
                    <Search size={20} color="var(--color-text-muted)" />
                    <input
                        type="number"
                        placeholder="Enter Mobile Number"
                        value={phone}
                        onChange={handlePhoneChange}
                        autoFocus
                    />
                </div>

                {operator && (
                    <div className="operator-card animate-slide-up mb-4 card text-center">
                        <Smartphone size={32} color="var(--color-brand)" className="mx-auto mb-2" />
                        <h3 className="text-primary">{operator} Prepaid</h3>
                        <p className="text-secondary">{phone}</p>
                    </div>
                )}

                {operator && (
                    <div className="plans-section animate-slide-up">
                        <h3 className="mb-2">Recommended Plans</h3>
                        <div className="plans-grid">
                            {MOCK_PLANS.map(plan => (
                                <div key={plan.id} className="plan-card card" onClick={() => handlePlanSelect(plan)}>
                                    <h2 className="plan-price">₹{plan.price}</h2>
                                    <div className="plan-details-row">
                                        <div className="pd-col">
                                            <span>Validity</span>
                                            <strong>{plan.validity}</strong>
                                        </div>
                                        <div className="pd-col">
                                            <span>Data</span>
                                            <strong>{plan.data}</strong>
                                        </div>
                                    </div>
                                    <button className="btn-secondary full-width mt-4">Select</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileRecharge;
