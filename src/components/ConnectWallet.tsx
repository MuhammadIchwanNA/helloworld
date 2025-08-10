import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const SEPOLIA = {
  chainId: "0xaa36a7",
  chainName: "Sepolia",
  nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://rpc.sepolia.org"],
  blockExplorerUrls: ["https://sepolia.etherscan.io/"],
};

export default function ConnectWallet() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>("");
  const [ensName, setEnsName] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("");
  const [network, setNetwork] = useState<string>("");
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const hasWallet = typeof window !== "undefined" && !!window.ethereum;

  const p = useMemo(() => (hasWallet ? new ethers.BrowserProvider(window.ethereum) : null), [hasWallet]);

  useEffect(() => {
    if (!p) return;
    setProvider(p);

    const onAccounts = async (accs: string[]) => {
      const addr = accs?.[0] ?? "";
      setAccount(addr);
      if (addr) await refresh(p, addr);
      else {
        setBalance("");
        setEnsName(null);
      }
    };

    const onChain = async () => {
      if (!account) return;
      await refresh(p, account);
    };

    window.ethereum?.on?.("accountsChanged", onAccounts);
    window.ethereum?.on?.("chainChanged", onChain);
    p.send("eth_accounts", []).then((accs: string[]) => onAccounts(accs));

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", onAccounts);
      window.ethereum?.removeListener?.("chainChanged", onChain);
    };
  }, [p]);

  async function refresh(provider: ethers.BrowserProvider, addr: string) {
    const net = await provider.getNetwork();
    setNetwork(`${net.name || "unknown"} (chainId ${String(net.chainId)})`);

    const b = await provider.getBalance(addr);
    const pretty = Number(ethers.formatEther(b)).toFixed(4).replace(/\.?0+$/, "");
    setBalance(pretty);

    const resolvedEns = await provider.lookupAddress(addr);
    setEnsName(resolvedEns || null);
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
      console.warn(e);
    } finally {
      setConnecting(false);
    }
  }

  async function switchToSepolia() {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA.chainId }],
      });
    } catch (e: any) {
      if (e?.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [SEPOLIA],
        });
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
    navigator.clipboard.writeText(account).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function disconnect() {
    setAccount("");
    setBalance("");
    setEnsName(null);
  }

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 16,
        background: "var(--panel)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
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
        <>
          <div style={{ display: "grid", gap: 6 }}>
            <div>
              <b>Address:</b> {ensName ?? short(account)}{" "}
              <button onClick={copy} className="quiet-link">
                {copied ? "copied!" : "copy"}
              </button>
            </div>
            <div>
              <b>Network:</b> {network || "Detecting…"}
            </div>
            <div>
              <b>Balance:</b> {balance ? `${balance} ETH` : "—"}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button onClick={switchToSepolia} className="btn">
              Switch to Sepolia
            </button>
            <button onClick={disconnect} className="btn" style={{ background: "#ffefef", color: "#a00" }}>
              Disconnect
            </button>
          </div>
        </>
      )}
    </div>
  );
}
