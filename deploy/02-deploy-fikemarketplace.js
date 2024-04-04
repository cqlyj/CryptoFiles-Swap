const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const fs = require("fs-extra");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const commissionFee = networkConfig[chainId].commissionFee;

  const args = [commissionFee];

  const fileMarketplace = await deploy("FileMarketplace", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  const CONTRACT_ADDRESS_FILE = "./constants/fileMarketplaceAddress.json";
  const currentAddress = JSON.parse(
    fs.readFileSync(CONTRACT_ADDRESS_FILE),
    "utf-8"
  );
  currentAddress[chainId] = [fileMarketplace.address];

  console.log("Storing fileMarketplace address...");
  fs.writeFileSync(CONTRACT_ADDRESS_FILE, JSON.stringify(currentAddress));
  console.log("Stored!");

  if (
    !developmentChains.includes(network.name) &&
    process.env.SEPOLIA_ETHERSCAN_API_KEY
  ) {
    await verify(fileMarketplace.address, args);
    log("Verified!");
  }
  log("_______________________________________");
};

module.exports.tags = ["fileMarketplace", "all"];
