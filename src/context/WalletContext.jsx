import { createContext, useContext, useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  CoinbaseWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletContext = createContext();

// Inner provider that uses wallet hooks
const WalletContextInner = ({ children }) => {
  const { publicKey, connected, connecting, disconnect, wallet } = useWallet();

  const value = useMemo(() => ({
    // User info
    publicKey,
    walletAddress: publicKey?.toString() || null,
    shortAddress: publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : null,
    
    // Status
    connected,
    connecting,
    isAuthenticated: connected && !!publicKey,
    
    // Wallet info
    walletName: wallet?.adapter?.name || null,
    walletIcon: wallet?.adapter?.icon || null,
    
    // Actions
    disconnect,
  }), [publicKey, connected, connecting, wallet, disconnect]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Main provider with Solana connection
export const SolanaWalletProvider = ({ children }) => {
  // Use devnet for testing, mainnet-beta for production
  const endpoint = useMemo(() => clusterApiUrl('mainnet-beta'), []);

  // Configure wallets
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new CoinbaseWalletAdapter(),
    new TorusWalletAdapter(),
    new LedgerWalletAdapter(),
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContextInner>
            {children}
          </WalletContextInner>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within SolanaWalletProvider');
  }
  return context;
};

export default WalletContext;
