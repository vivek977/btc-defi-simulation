// scripts/repayAndWithdraw.js
const hre = require("hardhat");

async function main() {
  console.log("Repaying DAI loan and withdrawing WBTC collateral...");

  const rawWhale = "0xF977814e90dA44bFA03b6295A0616a897441aceC";
  const user = hre.ethers.utils.getAddress(rawWhale);

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [user],
  });
  const signer = await hre.ethers.getSigner(user);

  const lendingPoolProvider = "0xb53c1a33016b2dc2ff3653530bff1848a515c8c";
  const ILendingPoolAddressesProvider = [
    "function getLendingPool() view returns (address)"
  ];
  const provider = await hre.ethers.getContractAt(
    ILendingPoolAddressesProvider,
    lendingPoolProvider,
    signer
  );
  const lendingPoolAddress = await provider.getLendingPool();
  const ILendingPool = [
    "function repay(address asset, uint256 amount, uint256 rateMode, address onBehalfOf) external returns (uint256)",
    "function withdraw(address asset, uint256 amount, address to) external returns (uint256)"
  ];
  const lendingPool = await hre.ethers.getContractAt(
    ILendingPool,
    lendingPoolAddress,
    signer
  );

  const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const dai = await hre.ethers.getContractAt("IERC20", daiAddress, signer);
  let daiBal = await dai.balanceOf(user);
  console.log(`Whale’s DAI before repay: ${hre.ethers.utils.formatUnits(daiBal, 18)} DAI`);

  const repayAmount = hre.ethers.utils.parseUnits("500", 18);

  console.log("Approving LendingPool to pull DAI for repay...");
  const approveTx = await dai.approve(lendingPoolAddress, repayAmount);
  await approveTx.wait(1);

  console.log("Repaying 500 DAI...");
  const repayTx = await lendingPool.repay(daiAddress, repayAmount, 2, user);
  await repayTx.wait(1);
  console.log("✅ Repay complete.");

  const wbtcAddress = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  console.log("Withdrawing all WBTC collateral from Aave...");
  const withdrawTx = await lendingPool.withdraw(wbtcAddress, 0, user);
  await withdrawTx.wait(1);
  console.log("✅ Withdrawal complete. Whale’s WBTC is back in their wallet.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});