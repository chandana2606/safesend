import React from 'react';
import { ArrowLeft, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './History.css';

const History = () => {
    const navigate = useNavigate();
    const { transactions } = useAppContext();

    const formatDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
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
                    {transactions.length === 0 ? (
                        <div className="text-center mt-8 text-secondary flex-col align-center">
                            <Inbox size={48} className="mx-auto mb-4 opacity-5" />
                            <p>No recent transactions</p>
                        </div>
                    ) : (
                        transactions.map(tx => {
                            const name = tx.contact?.name || tx.contactPhone || 'Unknown';
                            const initial = name.charAt(0).toUpperCase();

                            return (
                                <div key={tx.id} className="transaction-item card">
                                    <div className={`tx-icon tx-success`}>
                                        {initial}
                                    </div>
                                    <div className="tx-details">
                                        <h4>{name}</h4>
                                        <p>{formatDate(tx.timestamp)} • Paid</p>
                                    </div>
                                    <span className={`tx-amount negative`}>
                                        -₹{(tx.amount + (tx.roundOffAmt || 0)).toFixed(2)}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;
