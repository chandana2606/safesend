import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, AlertTriangle, User, Mic, Building } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './SendMoney.css';



const AudioAutoPlay = ({ name, phone, amount, playVoice }) => {
    useEffect(() => {
        if (!amount) {
            const spokenNumber = phone ? phone.split('').join(' ') : '';
            if (name === 'Unknown Contact' || name === 'Unknown User' || !name) {
                playVoice(`You are sending money to unknown contact, number ${spokenNumber}`);
            } else {
                playVoice(`You are sending money to ${name}, number ${spokenNumber}`);
            }
        } else {
            playVoice(`You are sending ${amount} rupees to ${name}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, phone, amount]);
    return null;
};

const getGeneratedName = (phone) => {
    const mockNames = ["Rahul Sharma", "Priya Singh", "Amit Kumar", "Neha Gupta", "Vikram Patel", "Sneha Reddy", "Arjun Das", "Pooja Verma", "Karan Malhotra", "Riya Desai"];
    return mockNames[(parseInt(phone.slice(-4)) || 0) % mockNames.length];
};

const SendMoney = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { playVoice } = useAppContext();
    const [step, setStep] = useState(1); // 1: Search, 2: Amount
    const initialMode = location.state?.mode || 'contact';
    const [mode] = useState(initialMode);
    const [query, setQuery] = useState(location.state?.scannedData || '');
    const [selectedContact, setSelectedContact] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [hasContactsPermission, setHasContactsPermission] = useState(null); // null = not asked, true = granted, false = denied

    const requestContactsPermission = () => {
        // Simulate permission request
        toast.info("Requesting contacts permission...");
        setTimeout(() => {
            setHasContactsPermission(true);
            toast.success("Contacts access granted");
        }, 1000);
    };

    const [amount, setAmount] = useState('');
    const [roundOff, setRoundOff] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);

    useEffect(() => {
        // Fetch all contacts on mount for the suggested list
        fetch('/api/contacts/all')
            .then(res => res.json())
            .then(data => {
                setAllContacts(data || []);
                setFilteredContacts(data || []);
            })
            .catch(err => console.error("Error fetching all contacts:", err));
    }, []);

    useEffect(() => {
        // Exact match logic
        if (mode === 'bank') {
            if (query.length >= 9 && /^\d+$/.test(query)) {
                setSelectedContact({ phone: query, name: 'Bank Account Transfer', isNew: true, isGlobal: true });
                setIsSearching(false);
            } else {
                setSelectedContact(null);
            }
        } else if (query.length === 10 && /^\d+$/.test(query)) {
            // Check permission before automatic lookup wrapper
            if (hasContactsPermission === false) {
                setSelectedContact({
                    phone: query,
                    name: getGeneratedName(query),
                    isNew: true,
                    isGlobal: true
                });
                return;
            }

            // Instant placeholder contact to avoid "No results" flickering
            setSelectedContact({
                phone: query,
                name: `Searching...`,
                isNew: true,
                isGlobal: false
            });

            setIsSearching(true);
            fetch(`/api/contacts?query=${query}`)
                .then(res => res.json())
                .then(data => {
                    if (data) setSelectedContact(data);
                    setIsSearching(false);
                })
                .catch(err => {
                    console.error("Error fetching contact:", err);
                    setSelectedContact({
                        phone: query,
                        name: getGeneratedName(query),
                        isNew: true,
                        isGlobal: true
                    });
                    setIsSearching(false);
                });
        } else if (query.length > 10) {
            // Probably a UPI ID or long number
            setSelectedContact({ phone: query, name: 'Unknown User', isNew: true, duplicates: false });
            setIsSearching(false);
        } else {
            setSelectedContact(null);
            setIsSearching(false);
        }

        // Filtering suggested list logic
        if (mode === 'bank') {
            setFilteredContacts([]);
        } else if (query.trim() === '') {
            setFilteredContacts(allContacts);
        } else {
            const lowerQuery = query.toLowerCase();
            const filtered = allContacts.filter(c =>
                c.name.toLowerCase().includes(lowerQuery) ||
                c.phone.includes(lowerQuery)
            );

            // Failsafe: If it's a 10-digit number but not in contacts, add it as a "New Contact" option
            if (query.length === 10 && /^\d+$/.test(query) && !filtered.find(c => c.phone === query)) {
                filtered.unshift({
                    phone: query,
                    name: getGeneratedName(query),
                    isNew: true,
                    isGlobal: true,
                    id: 'new-' + query
                });
            }

            setFilteredContacts(filtered);
        }
    }, [query, allContacts]);

    const handleProceedToAmount = () => {
        if (selectedContact) setStep(2);
    };

    const playVoiceConfirmation = () => {
        playVoice(`You are sending money to ${selectedContact.name}`);
    };

    const handleProceedToConfirm = () => {
        if (!amount) return;
        playVoiceConfirmation();
        // Pass state to confirmation page (which will now ask for PIN first)
        navigate('/confirm', {
            state: {
                contact: selectedContact,
                amount: parseFloat(amount),
                roundOffAmt: roundOff ? getRoundOffAmount(parseFloat(amount)) : 0
            }
        });
    };

    const getRoundOffAmount = (amt) => {
        if (!amt) return 0;
        const nextTen = Math.ceil(amt / 10) * 10;
        return nextTen === amt ? 0 : nextTen - amt;
    };

    return (
        <div className="send-money-page">
            <header className="page-header">
                <button className="icon-btn" onClick={() => step === 1 ? navigate(-1) : setStep(1)}>
                    <ArrowLeft size={24} />
                </button>
                <h2>{step === 1 ? (mode === 'bank' ? 'Send to Bank Account' : 'Send Money') : 'Enter Amount'}</h2>
            </header>

            {step === 1 && (
                <div className="step-content animate-slide-up">
                    <div className="search-bar card">
                        {mode === 'bank' ? <Building size={20} color="var(--color-text-muted)" /> : <Search size={20} color="var(--color-text-muted)" />}
                        <input
                            type="text"
                            placeholder={mode === 'bank' ? "Enter Bank Account Number" : "Enter Phone Number or UPI ID"}
                            value={query}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Limit based on mode
                                if (/^\d+$/.test(val)) {
                                    if (mode === 'contact' && val.length > 10) return;
                                    if (mode === 'bank' && val.length > 18) return;
                                }

                                if (val.length > query.length) {
                                    const char = val.slice(-1);
                                    if (/[0-9]/.test(char)) {
                                        playVoice(char, false);
                                    }
                                }
                                setQuery(val);
                            }}
                            autoFocus
                        />
                    </div>

                    <p className="hint-text">{mode === 'bank' ? "Enter a 9-18 digit account number" : "Try: 9876543210 (Known) or 8888888888 (New)"}</p>

                    {mode === 'contact' && hasContactsPermission === null && (
                        <div className="permission-prompt card mb-4 animate-fade-in" style={{ backgroundColor: 'var(--color-bg-input)', border: '1px solid var(--color-brand)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <User size={24} color="var(--color-brand)" />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>Sync Contacts</h4>
                                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Allow SafeSend to access contacts to display receiver names instantly.</p>
                                </div>
                                <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={requestContactsPermission}>Allow</button>
                                <button className="icon-btn" onClick={() => setHasContactsPermission(false)}><ArrowLeft size={16} /></button>
                            </div>
                        </div>
                    )}
                    {mode === 'contact' && hasContactsPermission === false && (
                        <div className="alert-box mb-4" style={{ backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba', borderRadius: '8px', padding: '12px', fontSize: '13px' }}>
                            Enable contacts permission in settings to automatically display receiver name.
                        </div>
                    )}

                    {isSearching && (
                        <div className="searching-state card animate-fade-in">
                            <div className="loader-sm"></div>
                            <p>Searching for {query}...</p>
                        </div>
                    )}

                    {selectedContact && !isSearching && (
                        <div className="contact-preview card animate-fade-in" onClick={handleProceedToAmount}>
                            <div className="contact-info-row">
                                <div className="avatar">
                                    <User size={24} color="var(--color-brand)" />
                                </div>
                                <div className="contact-details">
                                    <h3 style={{ color: selectedContact.name === 'Unknown User' ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' }}>{selectedContact.name !== 'Unknown User' ? `Receiver: ${selectedContact.name}` : 'Unknown User'}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <p>{selectedContact.phone}</p>
                                        {query.length === 10 && /^\d+$/.test(query) && <div style={{ background: 'var(--color-success)', borderRadius: '50%', width: '12px', height: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: 'white', fontSize: '8px', fontWeight: 'bold' }}>✓</span></div>}
                                    </div>
                                    {selectedContact.isGlobal && <span className="global-badge">Verified on SafeSend</span>}
                                </div>
                            </div>

                            {selectedContact.isNew && !selectedContact.isGlobal && (
                                <div className="alert-box warning">
                                    <AlertTriangle size={16} />
                                    <span>⚠️ You have never sent money to this number before</span>
                                </div>
                            )}

                            {selectedContact.duplicates && (
                                <div className="alert-box danger">
                                    <AlertTriangle size={16} />
                                    <span>⚠️ Multiple contacts found. Please confirm the correct person.</span>
                                </div>
                            )}

                            <button className="btn-primary full-width mt-4">Continue to Pay</button>
                        </div>
                    )}

                    {mode === 'contact' && !selectedContact && !isSearching && (
                        <div className="suggested-contacts-section mt-4">
                            <h3 className="section-title">{query ? 'Search Results' : 'Recents & Contacts'}</h3>
                            <div className="contacts-list">
                                {filteredContacts.length > 0 ? (
                                    filteredContacts.map(contact => (
                                        <div
                                            key={contact.id || contact.phone}
                                            className="contact-item-row"
                                            onClick={() => {
                                                setSelectedContact(contact);
                                                setQuery(contact.phone);
                                            }}
                                        >
                                            <div className="contact-avatar-small">
                                                {contact.name.charAt(0)}
                                            </div>
                                            <div className="contact-text">
                                                <h4>{contact.name}</h4>
                                                <p>{contact.phone}</p>
                                            </div>
                                            <div className="chevron-right">›</div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="empty-msg">No contacts found for "{query}"</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {step === 2 && selectedContact && (
                <div className="step-content text-center animate-fade-in">
                    <div className="payment-target-area">
                        {/* Highlighted Recipient Name and ID */}
                        <div className="payment-hero card mb-6" style={{ background: 'var(--color-bg-input)', border: 'none', padding: '24px' }}>
                            <div className="avatar large-avatar mx-auto mb-3">
                                <User size={40} color="var(--color-brand)" />
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: selectedContact.name === 'Unknown User' ? 'var(--color-text-secondary)' : 'var(--color-text-primary)' }}>
                                {selectedContact.name !== 'Unknown User' ? `Receiver: ${selectedContact.name}` : 'Unknown User'}
                            </h2>
                            <p style={{ color: 'var(--color-brand)', fontWeight: '600', letterSpacing: '0.5px', marginTop: '4px' }}>{selectedContact.phone}</p>
                        </div>

                        <AudioAutoPlay name={selectedContact.name} phone={selectedContact.phone} amount={amount} playVoice={playVoice} />
                    </div>

                    <div className="amount-input-wrapper">
                        <span className="currency-symbol">₹</span>
                        <input
                            type="number"
                            className="amount-input"
                            placeholder="0"
                            value={amount}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.length > amount.length) {
                                    const char = val.slice(-1);
                                    if (/[0-9]/.test(char)) {
                                        playVoice(char, false);
                                    }
                                }
                                setAmount(val);
                            }}
                            autoFocus
                        />
                    </div>

                    {amount && parseFloat(amount) > 0 && getRoundOffAmount(parseFloat(amount)) > 0 && (
                        <div className="jar-savings-card card animate-slide-up" onClick={() => setRoundOff(!roundOff)}>
                            <div className="jar-left">
                                <h4>Save to Jar?</h4>
                                <p>Round off to ₹{Math.ceil(amount / 10) * 10} and save ₹{getRoundOffAmount(parseFloat(amount))}</p>
                            </div>
                            <div className={`checkbox ${roundOff ? 'checked' : ''}`}></div>
                        </div>
                    )}

                    <div className="action-buttons" style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '32px' }}>
                        <button
                            className="btn-primary full-width"
                            onClick={handleProceedToConfirm}
                            disabled={!amount || parseFloat(amount) <= 0}
                        >
                            Proceed to Pay
                        </button>
                        <button
                            className="btn-secondary full-width"
                            style={{ color: 'var(--color-danger)', border: '1px solid var(--color-danger)', background: 'transparent' }}
                            onClick={() => navigate(-1)}
                        >
                            Cancel Payment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SendMoney;
