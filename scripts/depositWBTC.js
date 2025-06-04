// scripts/depositWBTC.js
const hre = require("hardhat");

async function main() {
  console.log("Depositing WBTC into Aave...");

  const rawWhale = "0xF977814e90dA44bFA03b6295A0616a897441aceC";
  const whale = hre.ethers.utils.getAddress(rawWhale);

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [whale],
  });
  const signer = await hre.ethers.getSigner(whale);

  const wbtcAddress = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  const lendingPoolAddressProvider = "0xb53c1a33016b2dc2ff3653530bff1848a515c8c";

  const ILendingPoolAddressesProvider = [
    "function getLendingPool() view returns (address)"
  ];

  const addressesProvider = await hre.ethers.getContractAt(
    ILendingPoolAddressesProvider,
    lendingPoolAddressProvider,
    signer
  );
  const lendingPoolAddress = await addressesProvider.getLendingPool();

  const ILendingPool = [
    "function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external"
  ];

  const lendingPool = await hre.ethers.getContractAt(
    ILendingPool,
    lendingPoolAddress,
    signer
  );

  const wbtc = await hre.ethers.getContractAt("IERC20", wbtcAddress, signer);
  const depositAmount = hre.ethers.utils.parseUnits("10", 8);

  console.log(`Approving Aave LendingPool to spend 10 WBTC...`);
  const approveTx = await wbtc.approve(lendingPoolAddress, depositAmount);
  await approveTx.wait(1);

  console.log(`Depositing 10 WBTC into Aave...`);
  const tx = await lendingPool.deposit(
    wbtcAddress,
    depositAmount,
    whale,
    0
  );
  await tx.wait(1);

  console.log("✅ Deposit complete. 10 WBTC is now collateral in Aave.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});