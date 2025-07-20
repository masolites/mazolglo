import dynamic from 'next/dynamic';
import '../styles/globals.css';

// Client-side only imports
const ThirdwebProvider = dynamic(
  () => import('@thirdweb-dev/react').then((mod) => mod.ThirdwebProvider),
  { 
    ssr: false,
    loading: () => <div>Loading wallet provider...</div>
  }
);

const WalletWrapper = dynamic(
  () => import('../components/WalletWrapper'),
  { ssr: false }
);

const ErrorBoundary = dynamic(
  () => import('../components/ErrorBoundary'),
  { ssr: false }
);

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <ThirdwebProvider
        activeChain="binance"
        clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
        supportedWallets={[
          {
            id: "injected",
            name: "Browser Wallet",
          },
          {
            id: "coinbase",
            name: "Coinbase",
          },
          {
            id: "walletConnect",
            name: "WalletConnect",
          }
        ]}
      >
        <WalletWrapper>
          <Component {...pageProps} />
        </WalletWrapper>
      </ThirdwebProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
