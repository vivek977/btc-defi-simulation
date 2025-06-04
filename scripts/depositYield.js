// scripts/depositYield.js
const hre = require("hardhat");

async function main() {
  console.log("Depositing borrowed DAI into Yearn v2 yDAI...");

  const rawWhale = "0xF977814e90dA44bFA03b6295A0616a897441aceC";
  const whale = hre.ethers.utils.getAddress(rawWhale);

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [whale],
  });
  const signer = await hre.ethers.getSigner(whale);

  const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const yDaiAddress = "0x19D3364A399d251E894aC732651be8B0E4e85001";

  const dai = await hre.ethers.getContractAt("IERC20", daiAddress, signer);
  const daiBal = await dai.balanceOf(whale);
  console.log(`Whale’s DAI before deposit: ${hre.ethers.utils.formatUnits(daiBal, 18)} DAI`);

  const depositAmount = daiBal.gte(hre.ethers.utils.parseUnits("500", 18))
    ? hre.ethers.utils.parseUnits("500", 18)
    : daiBal;

  console.log(`Approving Yearn vault to spend ${hre.ethers.utils.formatUnits(depositAmount, 18)} DAI...`);
  const approveTx = await dai.approve(yDaiAddress, depositAmount);
  await approveTx.wait(1);

  const IYearnVault = [
    "function deposit(uint256 amount) external returns (uint256)"
  ];
  const yVault = await hre.ethers.getContractAt(IYearnVault, yDaiAddress, signer);
  console.log(`Depositing into yDAI vault...`);
  const tx = await yVault.deposit(depositAmount);
  await tx.wait(1);

  console.log("✅ Deposit into Yearn yDAI vault complete.");
  const yDaiBal = await yVault.balanceOf(whale);
  console.log(`yDAI Balance: ${hre.ethers.utils.formatUnits(yDaiBal, 18)} yDAI`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});