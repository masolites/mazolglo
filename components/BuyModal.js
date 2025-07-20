import { useState } from 'react';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import styles from '../styles/BuyModal.module.css';

const useActiveAccount = dynamic(
  () => import('@thirdweb-dev/react').then((mod) => mod.useActiveAccount),
  { ssr: false }
);

export default function BuyModal({ onClose }) {
  const account = useActiveAccount?.();
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  const handlePurchase = async () => {
    if (!account?.address) {
      setMessage({ text: 'Connect your wallet first', isError: true });
      return;
    }
    if (!amount || isNaN(amount) {
      setMessage({ text: 'Please enter a valid amount', isError: true });
      return;
    }
    if (!email.includes('@')) {
      setMessage({ text: 'Please enter a valid email', isError: true });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: account.address,
          amount: parseFloat(amount),
          email,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ 
          text: `Success! ${(amount * 1000).toLocaleString()} MZLx tokens will be sent to your wallet`, 
          isError: false 
        });
        setTimeout(() => onClose(), 3000);
      } else {
        setMessage({ 
          text: data.message || 'Purchase failed', 
          isError: true 
        });
      }
    } catch (error) {
      setMessage({ 
        text: 'Transaction failed. Please try again.', 
        isError: true 
      });
      console.error('Purchase error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script 
        src="https://checkout.flutterwave.com/v3.js" 
        strategy="lazyOnload"
        onError={(e) => {
          console.error('Flutterwave script failed to load', e);
          setMessage({ 
            text: 'Payment system loading failed. Please refresh.', 
            isError: true 
          });
        }}
      />
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <h2>Purchase MZLx Tokens</h2>
          <p className={styles.rate}>1 NGN = 1,000 MZLx tokens</p>
          
          <div className={styles.inputGroup}>
            <label>Amount in NGN</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              min="1"
              step="1"
              disabled={loading}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
              required
            />
          </div>
          
          <div className={styles.tokenCalculation}>
            {amount && !isNaN(amount) && (
              <p>You'll receive: {(amount * 1000).toLocaleString()} MZLx tokens</p>
            )}
          </div>
          
          {message.text && (
            <p className={message.isError ? styles.errorMessage : styles.successMessage}>
              {message.text}
            </p>
          )}
          
          <button
            onClick={handlePurchase}
            disabled={loading || !amount || !email.includes('@')}
            className={styles.confirmButton}
          >
            {loading ? 'Processing...' : 'Confirm Purchase'}
          </button>
          
          <button
            onClick={onClose}
            disabled={loading}
            className={styles.closeButton}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
