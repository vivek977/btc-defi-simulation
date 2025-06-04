// scripts/monitorHealthFactor.js
const hre = require("hardhat");

async function main() {
  console.log("Checking Aave health factor...");

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
    "function getUserAccountData(address user) view returns (uint256, uint256, uint256, uint256, uint256, uint256)"
  ];
  const lendingPool = await hre.ethers.getContractAt(
    ILendingPool,
    lendingPoolAddress,
    signer
  );

  const accountData = await lendingPool.getUserAccountData(user);
  const rawHealthFactor = accountData[5];
  const hf = hre.ethers.utils.formatUnits(rawHealthFactor, 18);
  console.log(`Health Factor: ${hf}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});