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

  const fileName = networkConfig[chainId].fileName;
  const fileSymbol = networkConfig[chainId].fileSymbol;
  const mintFee = networkConfig[chainId].mintFee;
  const fileTokenURI = "test URI";

  const args = [fileName, fileSymbol, fileTokenURI, mintFee];

  const fileToken = await deploy("FileToken", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  console.log(fileToken.address);

  if (
    !developmentChains.includes(network.name) &&
    process.env.SEPOLIA_ETHERSCAN_API_KEY
  ) {
    await verify(fileToken.address, args);
    log("Verified!");
  }
  log("_______________________________________");
};

module.exports.tags = ["FileToken", "all"];
