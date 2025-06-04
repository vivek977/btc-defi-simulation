// scripts/simulate.js
const hre = require("hardhat");

async function main() {
  console.log("Forking Ethereum mainnet...");

  const rawWhale = "0xF977814e90dA44bFA03b6295A0616a897441aceC";
  const whale = hre.ethers.utils.getAddress(rawWhale);

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [whale],
  });

  console.log(`Impersonating address: ${whale}`);

  const signer = await hre.ethers.getSigner(whale);

  const wbtcAddress = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  const wbtc = await hre.ethers.getContractAt("IERC20", wbtcAddress, signer);

  const rawBalance = await wbtc.balanceOf(whale);
  console.log(
    `WBTC Balance of whale: ${hre.ethers.utils.formatUnits(rawBalance, 8)} WBTC`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});