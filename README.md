# 0xGasless Smart Wallet Controller & Debugger

A graphical user interface (GUI) designed for developers to directly interact with and debug **0xGasless smart accounts**.  
This tool provides a clean, direct interface for testing gasless transactions.

This project is a **developer-focused alternative** to the official  
👉 [**0xGasless AgentKit Chat Interface**](https://github.com/0xgasless/agentkit-chat-interface).  

While the official repository uses a powerful AI chat agent for natural language commands, it requires an **OpenRouter API key** and credits to function.  

This debugger was created to **bypass that requirement**, offering a direct, form-based way to test smart account functionalities without any AI service dependencies.

---

## 🔧 A Developer-Focused Example

This repository serves as a practical example for developers looking to integrate 0xGasless functionalities. A few key points:

- **Direct AgentKit Usage**  
  This application bypasses the `@0xgasless/smart-account` package and interacts directly with `@0xgasless/agentkit`.  
  This approach can be simpler, more efficient, and gives developers a clearer view of the underlying tools.

- **Server-Side Logging**  
  All transaction executions are handled by a server-side API route.  
  Important information about the agent's actions, arguments, and results is logged in the terminal, providing a valuable debugging trail.

---

## ✨ Features

- **Wallet Management**: Create a new burner wallet or import an existing one via private key.  
- **Session Persistence**: Your wallet's private key is securely stored in a browser cookie for 30 days.  
- **Smart Account Info**: Instantly fetch your smart account address and all associated token balances.  
- **Gasless Native & ERC20 Transfers**: Send native currency or ERC20 tokens without needing gas.  
- **Gasless Swaps**: Execute complex swaps between different tokens directly from the interface.  
- **Real-time Feedback**: Get immediate visual feedback on transaction execution.  

---

## ⛓️ Multi-Chain Configuration

This application is configured for **Avalanche Mainnet** by default but can be adapted for any chain supported by 0xGasless AgentKit.

### To switch networks:

1. **Update Environment Variables**  
   Change the `RPC_URL` and `CHAIN_ID` in your `.env.local` file to match your target network.

2. **Update Token Details**  
   In `components/SmartWalletUI.tsx`, modify the token maps (`AVALANCHE_TOKEN_MAP`, `ERC20_SYMBOLS`, `SWAP_SYMBOLS`) with the correct token addresses and symbols for your new chain.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)  
- **Language**: TypeScript  
- **Styling**: Tailwind CSS  
- **Web3 SDK**: `@0xgasless/agentkit`  
- **Blockchain Libraries**: `viem` and `ethers.js`  

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Prerequisites

- Node.js (**v18.18 or higher recommended**)  
- An API key from **0xGasless**  

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/smart-wallet-debugger.git
cd smart-wallet-debugger
````

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Environment Variables

Create a new file named **`.env.local`** in the root of the project:

```ini
# .env.local

# Get this from your 0xGasless dashboard
OXGASLESS_API_KEY="your_0xgasless_api_key_here"

# Network configuration
RPC_URL="https://api.avax.network/ext/bc/C/rpc" # Avalanche Mainnet
CHAIN_ID="43114"

# Set to "true" to use EOA instead of smart wallet (this app is hardcoded to "false")
USE_EOA="false"
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤔 How It Works

* **Wallet Management (Client-Side)**
  `components/Wallet.tsx` prompts you to create or import a wallet.
  The private key is stored only in a browser cookie.

* **API Interaction**
  The frontend makes a `POST` request to `/api/execute` with the private key, action name, and arguments.

* **Secure Execution (Server-Side)**
  The Next.js API route (`app/api/execute/route.ts`) initializes the `@0xgasless/agentkit` on the server.
  It builds, signs, and sends the gasless transaction via the 0xGasless bundler and paymaster.

* **Result Handling**
  The API route returns a success or error message to the frontend, which is displayed in the **Result panel**.

---

## 📚 Agent Toolkit Guide

This repository also includes an additional guide:
👉 [**AGENT\_TOOLKIT\_GUIDE.md**](./AGENT_TOOLKIT_GUIDE.md)

The guide provides a **detailed overview of all the tools available in the 0xGasless AgentKit Toolkit**.
These tools enable a wide range of **on-chain actions** and **data retrieval capabilities**, making it easier for developers to explore and extend the system.

---

## 📂 File Structure Overview

```
/
├── app/
│   ├── api/execute/route.ts  # The core backend logic for all smart account actions.
│   ├── layout.tsx            # Root layout, includes the Quantico font.
│   └── page.tsx              # Main page that conditionally renders Wallet or SmartWalletUI.
├── components/
│   ├── SmartWalletUI.tsx     # The main debugger interface with forms for transfers and swaps.
│   └── Wallet.tsx            # Component for creating/importing wallets and managing cookies.
├── lib/
│   └── wallet.ts             # Utility functions for generating keys and addresses.
├── public/
│   └── 0xGasless.png         # Project logo.
└── AGENT_TOOLKIT_GUIDE.md    # Detailed guide on all available AgentKit tools
```

---

## ⚠️ Disclaimer

This is a **developer tool intended for testing and debugging purposes**.
While care has been taken to handle private keys on the client-side, you should **never use a primary wallet** or a wallet with significant funds in any development environment.

👉 Always use **burner wallets** for testing.

