import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Minimal type for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function ConnectWallet() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [network, setNetwork] = useState<string>("");

  useEffect(() => {
    if (window.ethereum) {
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);

      // react to account / network changes
      window.ethereum.on?.("accountsChanged", (accs: string[]) => {
        setAccount(accs?.[0] || "");
        if (accs?.[0]) fetchBalance(p, accs[0]);
      });
      window.ethereum.on?.("chainChanged", () => {
        // reload to pick up new chain
        window.location.reload();
      });
    }
  }, []);

  async function connect() {
    try {
      if (!provider) {
        alert("MetaMask not found. Please install it first.");
        return;
      }
      const accs = await provider.send("eth_requestAccounts", []);
      const address = accs[0];
      setAccount(address);

      const net = await provider.getNetwork();
      setNetwork(`${net.name} (chainId ${net.chainId})`);

      await fetchBalance(provider, address);
    } catch (err) {
      console.error(err);
      alert("Could not connect wallet.");
    }
  }

  async function fetchBalance(p: ethers.BrowserProvider, address: string) {
    try {
      const b = await p.getBalance(address);
      setBalance(ethers.formatEther(b)); // in ETH
    } catch (e) {
      console.error(e);
      setBalance("");
    }
  }

  function short(addr: string) {
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
    }

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
      <p style={{ marginTop: 0 }}>
        Connect your wallet (try **Sepolia** testnet in MetaMask).
      </p>

      {!account ? (
        <button onClick={connect} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #111" }}>
          Connect Wallet
        </button>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          <div><b>Address:</b> {short(account)}</div>
          <div><b>Network:</b> {network || "Detecting..."}</div>
          <div><b>Balance:</b> {balance ? `${balance} ETH` : "—"}</div>
          <small style={{ opacity: 0.7 }}>
            Tip: switch MetaMask to <b>Sepolia</b> and click your browser refresh if needed.
          </small>
        </div>
      )}
    </div>
  );
}
