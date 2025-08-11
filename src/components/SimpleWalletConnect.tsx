// src/components/SimpleWalletConnect.tsx
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'

export default function SimpleWalletConnect() {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()

  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <h4>🔗 Wallet Connection</h4>
      
      {isConnected ? (
        <div>
          <p>✅ Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
          <button className="btn" onClick={() => open()}>
            Manage Wallet
          </button>
        </div>
      ) : (
        <div>
          <p>Connect your wallet to get started</p>
          <button className="btn" onClick={() => open()}>
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  )
}
