import { defaultWagmiConfig } from '@web3modal/wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

// Get Project ID from environment variable or use your actual Project ID
// Replace 'your-actual-project-id-here' with your real Project ID from https://cloud.reown.com/
export const projectId = process.env.VITE_PROJECT_ID || '8a101d3559f8ccf9a4a026913ff3b988';

// Configure chains - including mainnet for broader compatibility
const chains = [mainnet, sepolia] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata: {
    name: 'HelloWorld',
    description: 'A personal portfolio with Web3 integration',
    url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
    icons: [typeof window !== 'undefined' ? `${window.location.origin}/favicon-light.png` : '/favicon-light.png']
  },
});
