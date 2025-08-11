// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Web3Modal setup with error handling
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi';
import { config, projectId } from './lib/wallet';

// Create a query client
const queryClient = new QueryClient();

// Debug Project ID
console.log('🔍 Project ID Debug:', {
  projectId,
  length: projectId.length,
  type: typeof projectId
});

// Create Web3Modal - Let's try a more direct approach
let web3ModalCreated = false;
try {
  console.log('🚀 Attempting to create Web3Modal...');
  
  if (!projectId || projectId === 'YOUR_PROJECT_ID_HERE' || projectId === 'your-actual-project-id-here') {
    throw new Error('Invalid Project ID detected');
  }
  
  const modal = createWeb3Modal({
    wagmiConfig: config,
    projectId: projectId,
  });
  
  web3ModalCreated = true;
  console.log('✅ Web3Modal created successfully!');
  console.log('� Modal instance:', modal);
  
} catch (error) {
  console.error('❌ Failed to create Web3Modal:', error);
  console.error('📋 Error details:', {
    message: (error as Error)?.message,
    stack: (error as Error)?.stack,
    projectId,
    config
  });
}

console.log('🎯 Web3Modal creation status:', web3ModalCreated);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
