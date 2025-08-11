// src/components/WalletConnection.tsx
import { useState, useEffect } from 'react';

// Simple wallet connection without hooks - using window.ethereum directly
export default function WalletConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');

  // Simple MetaMask connection
  const connectWallet = async () => {
    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        alert('Please install MetaMask to connect your wallet');
        return;
      }

      const ethereum = (window as any).ethereum;
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length > 0) {
        setIsConnected(true);
        setAddress(accounts[0]);
        console.log('✅ Connected to:', accounts[0]);
      }
    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress('');
    console.log('🔌 Wallet disconnected');
  };

  // Check if already connected
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          const ethereum = (window as any).ethereum;
          const accounts = await ethereum.request({ 
            method: 'eth_accounts' 
          });
          
          if (accounts.length > 0) {
            setIsConnected(true);
            setAddress(accounts[0]);
          }
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <h4>🔗 Wallet Connection</h4>
      
      {isConnected ? (
        <div>
          <p>✅ Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
          <button className="btn" onClick={disconnectWallet}>
            Disconnect
          </button>
        </div>
      ) : (
        <div>
          <p>Connect your MetaMask wallet to get started</p>
          <button className="btn" onClick={connectWallet}>
            Connect Wallet
          </button>
          <p><small>📱 Make sure MetaMask is installed and unlocked</small></p>
        </div>
      )}

      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>
        <p><strong>Status:</strong></p>
        <ul style={{ fontSize: '0.8rem', textAlign: 'left', margin: '0.5rem 0' }}>
          <li>MetaMask: {typeof window !== 'undefined' && (window as any).ethereum ? '✅ Detected' : '❌ Not Found'}</li>
          <li>Connected: {isConnected ? '✅ Yes' : '❌ No'}</li>
          <li>Address: {address || 'None'}</li>
        </ul>
      </div>
    </div>
  );
}
