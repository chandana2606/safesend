import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './History.css';

const History = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetch('/api/transactions')
            .then(res => res.json())
            .then(data => {
                setTransactions(data);
            })
            .catch(err => console.error(err));
    }, []);

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleString();
    };

    return (
        <div className="history-page animate-fade-in">
            <header className="page-header text-white">
                <button className="icon-btn dark" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h2>Transaction History</h2>
            </header>

            <div className="history-content">
                <div className="transaction-list mt-4">
                    {transactions.map(tx => (
                        <div key={tx.id} className="transaction-item card">
                            <div className={`tx-icon tx-success`}>
                                {tx.contactPhone.charAt(0)}
                            </div>
                            <div className="tx-details">
                                <h4>{tx.contactPhone}</h4>
                                <p>{formatDate(tx.timestamp)} • Paid</p>
                            </div>
                            <span className={`tx-amount negative`}>
                                -₹{tx.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default History;
