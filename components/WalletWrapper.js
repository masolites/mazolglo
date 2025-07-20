import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/Wallet.module.css';

const ConnectButton = dynamic(
  () => import('@thirdweb-dev/react').then((mod) => mod.ConnectButton),
  { ssr: false }
);

export function WalletWrapper({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={styles.walletLoading}>
        <h2>Initializing Wallet System...</h2>
        <div className={styles.connectButtonWrapper}>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return children;
}
