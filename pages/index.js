import { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';

// Dynamically import all wallet components
const ConnectButton = dynamic(
  () => import('@thirdweb-dev/react').then((mod) => mod.ConnectButton),
  { 
    ssr: false,
    loading: () => <button disabled>Loading wallet...</button>
  }
);

const useActiveAccount = dynamic(
  () => import('@thirdweb-dev/react').then((mod) => mod.useActiveAccount),
  { ssr: false }
);

const BuyModal = dynamic(() => import('../components/BuyModal'), {
  ssr: false,
  loading: () => <div className={styles.loading}>Loading purchase interface...</div>,
});

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const account = useActiveAccount?.();

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>MAZOL MZLx Token Private Sale</h1>
      <div className={styles.connectWrapper}>
        <ConnectButton 
          theme="dark"
          btnTitle="Connect Wallet"
          modalTitle="Connect to Buy Tokens"
          modalSize="wide"
          welcomeScreen={{
            title: "Connect your wallet to participate in the MZLx token sale",
          }}
        />
      </div>
      
      {account && (
        <button
          onClick={() => setShowModal(true)}
          className={styles.buyButton}
        >
          Buy MZLx Tokens
        </button>
      )}
      
      {showModal && (
        <BuyModal onClose={() => setShowModal(false)} />
      )}
    </main>
  );
}

// Disable static generation
export async function getServerSideProps() {
  return {
    props: {},
  };
}
