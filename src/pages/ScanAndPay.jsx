import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import './ScanAndPay.css';

const ScanAndPay = () => {
    const navigate = useNavigate();
    const [scanResult, setScanResult] = useState(null);

    useEffect(() => {
        let scanner = null;

        const initScanner = async () => {
            try {
                scanner = new Html5QrcodeScanner("reader", {
                    qrbox: { width: 250, height: 250 },
                    fps: 10,
                });

                scanner.render(
                    (result) => {
                        setScanResult(result);

                        // Clean up scanner after success
                        scanner.clear().then(() => {
                            if (result.startsWith('upi://pay')) {
                                try {
                                    const url = new URL(result);
                                    const upiId = url.searchParams.get('pa');
                                    const name = url.searchParams.get('pn') || 'Unknown Merchant';

                                    toast.success(`Scanned: ${name}`);

                                    setTimeout(() => {
                                        navigate('/send', { state: { scannedData: upiId, scannedName: name } });
                                    }, 500);
                                } catch (e) {
                                    toast.error("Invalid UPI QR format");
                                }
                            } else {
                                // Fallback to raw data
                                const strippedResult = result.replace(/[^0-9a-zA-Z.@]/g, '');
                                toast.success(`Scanned: ${strippedResult}`);

                                setTimeout(() => {
                                    navigate('/send', { state: { scannedData: strippedResult } });
                                }, 500);
                            }
                        }).catch(e => {
                            console.error("Clear error", e);
                            navigate('/send', { state: { scannedData: result } });
                        });
                    },
                    (error) => {
                        // Silent fail for scanning frames
                    }
                );
            } catch (err) {
                console.error("Scanner init error", err);
                toast.error("Failed to start camera. Check permissions.");
            }
        };

        initScanner();

        return () => {
            if (scanner) {
                scanner.clear().catch(err => { });
            }
        };
    }, [navigate]);

    return (
        <div className="scan-page animate-fade-in">
            <header className="page-header transparent">
                <button className="icon-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h2>Scan QR Code</h2>
            </header>

            <div className="scanner-container">
                <p className="scanner-instruction">Point camera at any UPI QR Code</p>
                <div id="reader" className="qr-reader"></div>
                {scanResult && <div className="result text-success mt-4">Scan successful! Redirecting...</div>}
            </div>
        </div>
    );
};

export default ScanAndPay;
