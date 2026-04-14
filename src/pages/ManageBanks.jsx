import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import './ManageBanks.css';

const ManageBanks = () => {
    const navigate = useNavigate();
    const { banks, setBanks } = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const [newBankName, setNewBankName] = useState('');
    const [newAccountNo, setNewAccountNo] = useState('');

    const toggleDefault = (id) => {
        setBanks(prev => prev.map(bank => ({
            ...bank,
            isDefault: bank.id === id
        })));
        toast.success('Default bank updated');
    };

    const removeBank = (id) => {
        if (banks.length <= 1) {
            toast.error('You must have at least one bank account');
            return;
        }
        setBanks(prev => prev.filter(bank => bank.id !== id));
        toast.info('Bank account removed');
    };

    const addBank = (e) => {
        e.preventDefault();
        if (!newBankName || !newAccountNo) return;

        const newBank = {
            id: Date.now(),
            name: newBankName,
            accountNo: `XXXX ${newAccountNo.slice(-4)}`,
            isDefault: false,
            icon: '🏦'
        };

        setBanks(prev => [...prev, newBank]);
        setNewBankName('');
        setNewAccountNo('');
        setIsAdding(false);
        toast.success(`${newBankName} added successfully`);
    };

    return (
        <div className="manage-banks-page animate-fade-in">
            <header className="page-header">
                <button className="icon-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h2>Manage Bank Accounts</h2>
            </header>

            <div className="banks-container">
                {banks.map(bank => (
                    <div
                        key={bank.id}
                        className={`bank-card card ${bank.isDefault ? 'default-border' : ''}`}
                        onClick={() => toggleDefault(bank.id)}
                    >
                        <div className="bank-icon">{bank.icon}</div>
                        <div className="bank-info">
                            <h3>{bank.name}</h3>
                            <p>{bank.accountNo}</p>
                            {bank.isDefault && <span className="default-badge">Primary Account</span>}
                        </div>
                        <div className="bank-actions">
                            {bank.isDefault ? (
                                <CheckCircle2 size={24} color="var(--color-success)" />
                            ) : (
                                <button
                                    className="remove-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeBank(bank.id);
                                    }}
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {!isAdding ? (
                    <button className="add-bank-btn card" onClick={() => setIsAdding(true)}>
                        <Plus size={24} />
                        <span>Add New Bank Account</span>
                    </button>
                ) : (
                    <form className="add-bank-form card animate-slide-up" onSubmit={addBank}>
                        <h3>Add Bank Details</h3>
                        <div className="input-group">
                            <label>Bank Name</label>
                            <input
                                type="text"
                                placeholder="e.g. ICICI Bank"
                                value={newBankName}
                                onChange={e => setNewBankName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Account Number</label>
                            <input
                                type="text"
                                placeholder="Last 4 digits"
                                maxLength={4}
                                value={newAccountNo}
                                onChange={e => setNewAccountNo(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
                            <button type="submit" className="btn-primary">Save Bank</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ManageBanks;
