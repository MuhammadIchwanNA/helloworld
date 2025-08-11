// src/components/Web3Debug.tsx
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function Web3Debug() {
  // Use the hooks directly
  const { open } = useWeb3Modal();
  const account = useAccount();
  useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    console.log('🔄 Attempting to connect...');
    console.log('🔍 Available variables:');
    console.log('- open function:', open);
    console.log('- account:', account);
    console.log('- window.ethereum:', typeof window !== 'undefined' ? (window as any).ethereum : 'undefined');
    
    // Check if Web3Modal open function is available
    if (!open) {
      console.error('❌ open function is null');
      alert('Web3Modal open function not available. The Web3Modal was not created properly.');
      return;
    }

    if (typeof open !== 'function') {
      console.error('❌ open is not a function');
      alert('Web3Modal open method not available. Check if Web3Modal was created correctly.');
      return;
    }

    // Check if MetaMask is installed
    if (typeof window !== 'undefined' && !(window as any).ethereum) {
      console.warn('⚠️ No Web3 wallet detected');
      alert('Please install MetaMask or another Web3 wallet to connect.');
      return;
    }

    try {
      console.log('🚀 Calling open()...');
      open();
      console.log('✅ Web3Modal opened successfully');
    } catch (error) {
      console.error('❌ Failed to open Web3Modal:', error);
      alert(`Failed to open wallet modal: ${error}`);
    }
  };

  const handleDisconnect = () => {
    try {
      console.log('🔌 Attempting to disconnect...');
      disconnect();
      console.log('✅ Disconnected from wallet');
    } catch (error) {
      console.error('❌ Failed to disconnect:', error);
    }
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', margin: '1rem 0' }}>
      <h4>🔍 Web3 Debug Panel</h4>
      
      <div style={{ marginBottom: '1rem' }}>
        <p><strong>Status:</strong></p>
        <ul style={{ fontSize: '0.9rem', textAlign: 'left' }}>
          <li>Web3Modal Available: {typeof open === 'function' ? '✅ Yes' : '❌ No'}</li>
          <li>Wallet Detected: {typeof window !== 'undefined' && (window as any).ethereum ? '✅ Yes' : '❌ No'}</li>
          <li>Connected: {account?.isConnected ? '✅ Yes' : '❌ No'}</li>
          <li>Address: {account?.address ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : 'None'}</li>
          <li>Chain ID: {account?.chainId || 'None'}</li>
        </ul>
      </div>

      <div>
        {account?.isConnected ? (
          <div>
            <p>✅ Connected to: {account.address?.slice(0, 6)}...{account.address?.slice(-4)}</p>
            <button className="btn" onClick={handleDisconnect}>Disconnect</button>
          </div>
        ) : (
          <button className="btn" onClick={handleConnect}>🔗 Test Connection</button>
        )}
      </div>
      
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>
        <p><strong>Troubleshooting:</strong></p>
        <ol style={{ textAlign: 'left', margin: 0 }}>
          <li>Install MetaMask extension</li>
          <li>Unlock your wallet</li>
          <li>Check browser console for errors</li>
          <li>Try refreshing the page</li>
        </ol>
      </div>
    </div>
  );
}
