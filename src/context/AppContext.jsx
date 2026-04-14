/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [balance, setBalance] = useState(() => parseFloat(localStorage.getItem('balance')) || 45210.50);
    const [jarBalance, setJarBalance] = useState(() => {
        const saved = localStorage.getItem('jarBalance');
        if (saved === '840') return 0; // Force reset old default
        return saved !== null ? parseFloat(saved) : 0;
    });
    const [voiceEnabled, setVoiceEnabled] = useState(() => {
        const saved = localStorage.getItem('voiceEnabled');
        return saved !== null ? JSON.parse(saved) : true;
    });

    // Auth state
    const [isLoggedIn, setIsLoggedIn] = useState(() => JSON.parse(localStorage.getItem('isLoggedIn')) || false);
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);


    // Bank state
    const [banks, setBanks] = useState(() => JSON.parse(localStorage.getItem('banks')) || [
        { id: 1, name: 'HDFC Bank', accountNo: 'XXXX 4521', isDefault: true, icon: '🏦' },
        { id: 2, name: 'SBI Bank', accountNo: 'XXXX 8890', isDefault: false, icon: '🏛️' }
    ]);

    // Security state
    const [security, setSecurity] = useState(() => JSON.parse(localStorage.getItem('security')) || {
        upiPin: '1234',
        biometricEnabled: false
    });

    const [cachedVoice, setCachedVoice] = useState(null);

    // Persistence Effect
    useEffect(() => {
        localStorage.setItem('balance', balance.toString());
        localStorage.setItem('jarBalance', jarBalance.toString());
        localStorage.setItem('voiceEnabled', JSON.stringify(voiceEnabled));
        localStorage.setItem('banks', JSON.stringify(banks));
        localStorage.setItem('security', JSON.stringify(security));
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
        localStorage.setItem('user', JSON.stringify(user));
    }, [balance, jarBalance, voiceEnabled, banks, security, isLoggedIn, user]);

    useEffect(() => {
        if (!('speechSynthesis' in window)) return;

        const loadVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length === 0) return;

            const femaleVoice = voices.find(v => {
                const n = v.name.toLowerCase();
                if (n.includes('male') || n.includes('david') || n.includes('mark') || n.includes('daniel') || n.includes('paul')) return false;
                return v.localService && (n.includes('female') || n.includes('woman') || n.includes('zira') || n.includes('samantha') || n.includes('karen') || n.includes('susan') || n.includes('victoria') || n.includes('google us english'));
            }) || voices.find(v => {
                const n = v.name.toLowerCase();
                if (n.includes('male') || n.includes('david') || n.includes('mark') || n.includes('daniel') || n.includes('paul')) return false;
                return n.includes('female') || n.includes('woman') || n.includes('zira') || n.includes('samantha') || n.includes('karen') || n.includes('susan') || n.includes('victoria') || n.includes('google us english');
            }) || voices.find(v => {
                const n = v.name.toLowerCase();
                return v.lang.startsWith('en') && !n.includes('male') && !n.includes('david') && !n.includes('mark') && !n.includes('daniel');
            });

            setCachedVoice(femaleVoice || voices[0]);
        };

        loadVoice();
        window.speechSynthesis.onvoiceschanged = loadVoice;
    }, []);

    const deductBalance = (amount, jarAmount = 0) => {
        if (balance >= amount) {
            setBalance(prev => prev - amount);
            if (jarAmount > 0) {
                setJarBalance(prev => prev + jarAmount);
            }
            return true;
        }
        return false;
    };

    const addBalance = (amount, jarAmount = 0) => {
        setBalance(prev => prev + amount);
        if (jarAmount > 0) {
            setJarBalance(prev => Math.max(0, prev - jarAmount));
        }
    };

    const withdrawFromJar = (amount) => {
        if (jarBalance >= amount) {
            setJarBalance(prev => prev - amount);
            setBalance(prev => prev + amount);
            return true;
        }
        return false;
    };

    const login = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    const playVoice = (text, interrupt = true) => {
        if (voiceEnabled && 'speechSynthesis' in window) {
            if (interrupt) window.speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(text);

            if (cachedVoice) {
                msg.voice = cachedVoice;
            }
            msg.pitch = 1.2;
            msg.rate = 1.5;

            window.speechSynthesis.speak(msg);
        }
    };

    const playSuccessSound = () => {
        if (!voiceEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const playTone = (freq, startTime, duration) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
                gain.gain.linearRampToValueAtTime(0, startTime + duration);
                osc.start(startTime);
                osc.stop(startTime + duration);
            };
            playTone(523.25, ctx.currentTime, 0.15); // C5
            playTone(1046.50, ctx.currentTime + 0.15, 0.35); // C6
        } catch (e) {
            console.warn('Audio play failed', e);
        }
    };

    return (
        <AppContext.Provider value={{
            balance,
            setBalance,
            jarBalance,
            setJarBalance,
            deductBalance,
            addBalance,
            voiceEnabled,
            setVoiceEnabled,
            playVoice,
            playSuccessSound,
            withdrawFromJar,
            banks,
            setBanks,
            security,
            setSecurity,
            isLoggedIn,
            login,
            logout,
            user
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
