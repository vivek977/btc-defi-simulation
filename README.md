# BTC DeFi Simulation

This repository provides a **hybrid simulation environment** for testing a Bitcoin-backed DeFi yield strategy—without risking real funds. It uses Hardhat’s mainnet fork to:

1. **Impersonate a WBTC whale**  
2. **Deposit WBTC into Aave as collateral**  
3. **Borrow stablecoins (e.g. DAI) against that collateral**  
4. **Deposit borrowed stablecoins into Yearn for yield**  
5. **Monitor your Aave health factor**  
6. **Repay borrowed stablecoins and withdraw collateral**  

A minimal **frontend** is provided for basic “one-click” calls.  

---

## 📁 Project Structure
btc-defi-simulation/
├── contracts/
│ └── IERC20.sol # Minimal ERC-20 interface
├── frontend/
│ └── index.html # Simple HTML/JS UI (Ethers.js + MetaMask)
├── scripts/
│ ├── simulate.js # Forks mainnet & reads a whale’s WBTC balance
│ ├── depositWBTC.js # Deposit WBTC into Aave LendingPool
│ ├── borrowStable.js # Borrow DAI against WBTC collateral
│ ├── depositYield.js # Deposit borrowed DAI into Yearn yDAI vault
│ ├── monitorHealthFactor.js # Check Aave health factor for liquidation risk
│ └── repayAndWithdraw.js # Repay DAI + withdraw WBTC
├── hardhat.config.js # Hardhat config (forks mainnet via Alchemy)
├── package.json # NPM dependencies and scripts
└── README.md # This file


---

## ⚙️ Prerequisites

1. **Node.js (v16 or newer) & npm**  
2. **Git**  
3. **MetaMask** (for the frontend/UI)  
4. **Alchemy (or Infura) API key** for Ethereum mainnet (for Hardhat forking)  

---

## 🔧 Setup

1. **Clone your repo locally**  
   ```bash
   git clone https://github.com/VIVEK977/btc-defi-simulation.git
   cd btc-defi-simulation
Install dependencies

npm install
Verify Hardhat compiles


npx hardhat compile

You should see:

Compiled 1 Solidity file successfully (evm target: paris)
Start a local Hardhat node (in a separate terminal)


npx hardhat node
This will fork Ethereum mainnet at the latest block and run a local JSON-RPC on http://127.0.0.1:8545.
