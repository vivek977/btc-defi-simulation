// scripts/borrowStable.js
const hre = require("hardhat");

async function main() {
  console.log("Borrowing stablecoin from Aave...");

  const rawWhale = "0xF977814e90dA44bFA03b6295A0616a897441aceC";
  const whale = hre.ethers.utils.getAddress(rawWhale);

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [whale],
  });
  const signer = await hre.ethers.getSigner(whale);

  const lendingPoolAddressProvider = "0xb53c1a33016b2dc2ff3653530bff1848a515c8c";
  const ILendingPoolAddressesProvider = [
    "function getLendingPool() view returns (address)"
  ];
  const providerContract = await hre.ethers.getContractAt(
    ILendingPoolAddressesProvider,
    lendingPoolAddressProvider,
    signer
  );
  const lendingPoolAddress = await providerContract.getLendingPool();
  const ILendingPool = [
    "function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf) external"
  ];
  const lendingPool = await hre.ethers.getContractAt(
    ILendingPool,
    lendingPoolAddress,
    signer
  );

  const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const borrowAmount = hre.ethers.utils.parseUnits("500", 18);

  console.log(`Borrowing 500 DAI against WBTC collateral...`);
  const tx = await lendingPool.borrow(
    daiAddress,
    borrowAmount,
    2,
    0,
    whale
  );
  await tx.wait(1);

  console.log("✅ Borrow complete. 500 DAI now in whale’s account.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});