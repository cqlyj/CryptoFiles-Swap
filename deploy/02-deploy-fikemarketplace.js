const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

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
