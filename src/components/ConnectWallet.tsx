import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

declare global {
  interface Window { ethereum?: any }
}

const SEPOLIA = {
  chainId: "0xaa36a7", // 11155111 in hex
  chainName: "Sepolia",
  nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://rpc.sepolia.org"],
  blockExplorerUrls: ["https://sepolia.etherscan.io/"],
};

export default function ConnectWallet() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [network, setNetwork] = useState<string>("");
  const [connecting, setConnecting] = useState(false);
  const hasWallet = typeof window !== "undefined" && !!window.ethereum;

  const p = useMemo(() => (hasWallet ? new ethers.BrowserProvider(window.ethereum) : null), [hasWallet]);

  useEffect(() => {
    if (!p) return;
    setProvider(p);

    const onAccounts = async (accs: string[]) => {
      const addr = accs?.[0] ?? "";
      setAccount(addr);
      if (addr) await refresh(p, addr);
      else setBalance("");
    };

    const onChain = async () => {
      // network changed: refresh network + balance but avoid hard reload
      if (!account) return;
      await refresh(p, account);
    };

    window.ethereum?.on?.("accountsChanged", onAccounts);
    window.ethereum?.on?.("chainChanged", onChain);

    // initial read
    p.send("eth_accounts", []).then((accs: string[]) => onAccounts(accs));

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", onAccounts);
      window.ethereum?.removeListener?.("chainChanged", onChain);
    };
  }, [p]); // eslint-disable-line react-hooks/exhaustive-deps

  async function refresh(provider: ethers.BrowserProvider, addr: string) {
    const net = await provider.getNetwork();
    setNetwork(`${net.name || "unknown"} (chainId ${String(net.chainId)})`);
    const b = await provider.getBalance(addr);
    // show 4 decimals, trim trailing zeros
    const pretty = Number(ethers.formatEther(b)).toFixed(4).replace(/\.?0+$/,"");
    setBalance(pretty);
  }

  async function connect() {
    if (!provider) return;
    try {
      setConnecting(true);
      const accs = await provider.send("eth_requestAccounts", []);
      const addr = accs[0] ?? "";
      setAccount(addr);
      await refresh(provider, addr);
    } catch (e) {
      // user rejected or other error — keep UI calm
      console.warn(e);
    } finally {
      setConnecting(false);
    }
  }

  async function switchToSepolia() {
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: SEPOLIA.chainId }] });
    } catch (e: any) {
      // If chain not added, add then switch
      if (e?.code === 4902) {
        await window.ethereum.request({ method: "wallet_addEthereumChain", params: [SEPOLIA] });
      } else {
        console.warn(e);
      }
    }
  }

  function short(addr: string) {
    return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";
  }

  function copy() {
    if (!account) return;
    navigator.clipboard.writeText(account).catch(() => {});
  }

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 12, background: "var(--panel)" }}>
      {!hasWallet && (
        <p style={{ margin: 0, color: "crimson" }}>
          No wallet detected. Install MetaMask to continue.
        </p>
      )}

      {hasWallet && !account && (
        <button onClick={connect} disabled={connecting} className="btn">
          {connecting ? "Connecting…" : "Connect Wallet"}
        </button>
      )}

      {account && (
        <div style={{ display: "grid", gap: 6 }}>
          <div><b>Address:</b> {short(account)} <button onClick={copy} className="quiet-link">copy</button></div>
          <div><b>Network:</b> {network || "Detecting…"}</div>
          <div><b>Balance:</b> {balance ? `${balance} ETH` : "—"}</div>
          <div style={{ marginTop: 6 }}>
            <button onClick={switchToSepolia} className="btn">Switch to Sepolia</button>
          </div>
        </div>
      )}
    </div>
  );
}