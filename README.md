# Create the README.txt file with the content provided
readme_content = """BTC DeFi Simulation

This repository provides a hybrid simulation environment for testing a Bitcoin-backed DeFi yield strategy—without risking real funds. It uses Hardhat’s mainnet fork to:

1. Impersonate a WBTC whale
2. Deposit WBTC into Aave as collateral
3. Borrow stablecoins (e.g. DAI) against that collateral
4. Deposit borrowed stablecoins into Yearn for yield
5. Monitor your Aave health factor
6. Repay borrowed stablecoins and withdraw collateral

A minimal frontend is provided for basic “one-click” calls.

---

📁 Project Structure

btc-defi-simulation/
├── contracts/
│   └── IERC20.sol                # Minimal ERC-20 interface
├── frontend/
│   └── index.html                # Simple HTML/JS UI (Ethers.js + MetaMask)
├── scripts/
│   ├── simulate.js               # Forks mainnet & reads a whale’s WBTC balance
│   ├── depositWBTC.js            # Deposit WBTC into Aave LendingPool
│   ├── borrowStable.js           # Borrow DAI against WBTC collateral
│   ├── depositYield.js           # Deposit borrowed DAI into Yearn yDAI vault
│   ├── monitorHealthFactor.js    # Check Aave health factor for liquidation risk
│   └── repayAndWithdraw.js       # Repay DAI + withdraw WBTC
├── hardhat.config.js             # Hardhat config (forks mainnet via Alchemy)
├── package.json                  # NPM dependencies and scripts
└── README.md                     # This file

---

⚙️ Prerequisites

- Node.js (v16 or newer) & npm
- Git
- MetaMask (for the frontend/UI)
- Alchemy (or Infura) API key for Ethereum mainnet (for Hardhat forking)

---

🔧 Setup

1. Clone your repo locally
   git clone https://github.com/VIVEK977/btc-defi-simulation.git
   cd btc-defi-simulation

2. Install dependencies
   npm install

3. Verify Hardhat compiles
   npx hardhat compile
   You should see:
   Compiled 1 Solidity file successfully (evm target: paris)

4. Start a local Hardhat node (in a separate terminal)
   npx hardhat node
   This will fork Ethereum mainnet at the latest block and run a local JSON-RPC on http://127.0.0.1:8545.

---

🚀 Running the Scripts

All scripts assume your Hardhat node is running (step 4 above). In a new terminal, run each command:

1. Simulate a WBTC Whale Balance
   npx hardhat run scripts/simulate.js --network hardhat
   - Forks mainnet
   - Impersonates a known WBTC whale
   - Prints the whale’s WBTC balance

2. Deposit WBTC into Aave
   npx hardhat run scripts/depositWBTC.js --network hardhat
   - Impersonates the same whale
   - Approves and deposits 10 WBTC as collateral into Aave v2 LendingPool

3. Borrow DAI Against WBTC
   npx hardhat run scripts/borrowStable.js --network hardhat
   - Borrows 500 DAI at a variable interest rate against the 10 WBTC collateral

4. Deposit Borrowed DAI into Yearn yDAI Vault
   npx hardhat run scripts/depositYield.js --network hardhat
   - Approves the Yearn v2 yDAI vault to pull 500 DAI
   - Deposits those 500 DAI into the Yearn yDAI vault (yield farming)

5. Monitor Aave Health Factor
   npx hardhat run scripts/monitorHealthFactor.js --network hardhat
   - Fetches getUserAccountData from Aave on the whale’s address
   - Prints the current health factor (aim to keep > 1.5 – 2 to avoid liquidation)

6. Repay DAI and Withdraw WBTC
   npx hardhat run scripts/repayAndWithdraw.js --network hardhat
   - Approves/repays 500 DAI to the Aave LendingPool
   - Withdraws all WBTC collateral back to the whale address

---

📱 Frontend UI (Optional)

A minimal HTML/JS frontend is available under frontend/index.html. It uses Ethers.js + MetaMask to:

1. Connect your wallet (MetaMask must be pointed to Localhost 8545)
2. Run the “Check WBTC Balance” button, which:
   - Calls hardhat_impersonateAccount
   - Reads the whale’s WBTC balance and logs it

You can extend it by wiring up the other buttons to the respective scripts or contract calls.

How to Launch

1. Ensure the Hardhat node is running on http://localhost:8545.
2. Open frontend/index.html in your browser.
3. Switch MetaMask network to Localhost 8545.
4. Click Connect MetaMask, then click Check WBTC Balance.

---

🔒 Key Addresses & Config

- WBTC Whale (Binance hot wallet):
  0xF977814e90dA44bFA03b6295A0616a897441aceC
- WBTC token (mainnet):
  0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599 (8 decimals)
- Aave v2 LendingPoolAddressesProvider (mainnet):
  0xb53c1a33016b2dc2ff3653530bff1848a515c8c
- DAI token (mainnet):
  0x6B175474E89094C44Da98b954EedeAC495271d0F (18 decimals)
- Yearn v2 yDAI vault:
  0x19D3364A399d251E894aC732651be8B0E4e85001

---

⚙️ Customization

- Change Collateral Amount:
  - In depositWBTC.js, modify parseUnits("10", 8) to deposit fewer or more WBTC.

- Change Borrow Amount:
  - In borrowStable.js, adjust parseUnits("500", 18) to borrow a different amount of DAI.

- Use USDC Instead of DAI:
  - Swap DAI addresses with USDC addresses (USDC is 6 decimals).
  - Update borrowStable.js, depositYield.js, and repayAndWithdraw.js accordingly.

- Switch to Aave v3 or Compound:
  - Replace Aave v2 addresses/ABIs with the v3 or Compound equivalents.

- Add More Yield Layers:
  - After depositing into Yearn, you could stake Yearn Vault tokens in Convex or other reward programs.

---

🧪 Testing & Debugging

- All scripts log progress and use .wait(1) to wait for one confirmation.
- If a script fails with “insufficient funds” or similar, try reducing the deposit/borrow amounts.
- To simulate a dramatic BTC price drop, add a test mock to override the Chainlink oracle in Hardhat (advanced).

---

🤝 Contributions & Issues

Feel free to submit pull requests or open issues if you find bugs or want to add new features (e.g., automated rebalancing, multi-step strategies, more frontend controls).

---


