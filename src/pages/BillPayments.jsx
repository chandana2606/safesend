import React, { useState } from 'react';
import { ArrowLeft, Zap, Smartphone, Wifi, Droplets, Flame, Tv, Building, CarFront, ShieldPlus, CreditCard, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './BillPayments.css';

const categories = [
    { id: 'electricity', title: 'Electricity', icon: Zap, color: '#f39c12' },
    { id: 'mobile', title: 'Mobile Recharge', icon: Smartphone, color: '#3498db' },
    { id: 'wifi', title: 'Broadband', icon: Wifi, color: '#9b59b6' },
    { id: 'water', title: 'Water', icon: Droplets, color: '#2980b9' },
    { id: 'gas', title: 'Gas Booking', icon: Flame, color: '#e74c3c' },
    { id: 'dth', title: 'DTH', icon: Tv, color: '#8e44ad' },
    { id: 'loan', title: 'Loan EMI', icon: Building, color: '#2c3e50' },
    { id: 'rent', title: 'Rent', icon: CreditCard, color: '#16a085' },
    { id: 'fastag', title: 'FASTag', icon: CarFront, color: '#d35400' },
    { id: 'insurance', title: 'Insurance', icon: ShieldPlus, color: '#27ae60' },
];

const BillPayments = () => {
    const navigate = useNavigate();
    const [selectedBill, setSelectedBill] = useState(null);
    const [amount, setAmount] = useState('');

    const handleCategoryClick = (cat) => {
        if (cat.id === 'mobile') {
            navigate('/recharge');
            return;
        }
        setSelectedBill(cat);
        setAmount(Math.floor(Math.random() * 2000) + 500); // Mock random bill amount
    };

    const handlePayBill = (billTitle, defaultAmount) => {
        navigate('/confirm', {
            state: {
                contact: { name: `${billTitle} Bill`, phone: 'Biller' },
                amount: parseFloat(defaultAmount || amount),
                roundOffAmt: 0,
                isRecharge: false,
                isInstant: true
            }
        });
    };

    return (
        <div className="bills-page animate-fade-in">
            <header className="page-header">
                <button className="icon-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h2>Recharge & Pay Bills</h2>
            </header>

            <div className="bills-content">
                <div className="my-bills card">
                    <div className="section-header">
                        <h3>My Pending Bills</h3>
                    </div>
                    <div className="pending-bill-item">
                        <div className="pb-icon"><Zap size={20} color="#f39c12" /></div>
                        <div className="pb-details">
                            <h4>BESCOM - Electricity</h4>
                            <p>Due in 3 days</p>
                        </div>
                        <button className="pay-small-btn" onClick={() => handlePayBill('BESCOM Electricity', 1240)}>Pay ₹1,240</button>
                    </div>
                </div>

                <h3>All Categories</h3>
                <div className="categories-grid card">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <div key={cat.id} className="category-item" onClick={() => handleCategoryClick(cat)}>
                                <div className="cat-icon-wrap" style={{ color: cat.color, backgroundColor: `${cat.color}15` }}>
                                    <Icon size={24} />
                                </div>
                                <span>{cat.title}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedBill && (
                <div className="modal-overlay animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) setSelectedBill(null); }}>
                    <div className="center-modal animate-slide-up">
                        <div className="modal-header">
                            <h3>Pay {selectedBill.title}</h3>
                            <button className="icon-btn" onClick={() => setSelectedBill(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p style={{ fontSize: '14px', color: 'gray', marginBottom: '8px', textAlign: 'center' }}>Enter amount</p>
                            <div className="bill-amt-display">
                                <span>₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    style={{ fontSize: '32px', width: '150px', border: 'none', outline: 'none', fontWeight: 'bold', color: 'var(--color-brand)', background: 'transparent' }}
                                />
                            </div>
                            <button className="btn-primary full-width mt-4" onClick={() => handlePayBill(selectedBill.title, amount)}>
                                Proceed to Pay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillPayments;
