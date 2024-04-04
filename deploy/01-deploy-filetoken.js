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

  const CONTRACT_ADDRESS_FILE = "./constants/fileTokenAddress.json";
  const CONTRACT_OWNER_ADDRESS_FILE = "./constants/fileTokenOwnerAddress.json";
  const currentAddress = JSON.parse(
    fs.readFileSync(CONTRACT_ADDRESS_FILE),
    "utf-8"
  );
  currentAddress[chainId] = [fileToken.address];

  const currentOwnerAddress = JSON.parse(
    fs.readFileSync(CONTRACT_OWNER_ADDRESS_FILE),
    "utf-8"
  );
  currentOwnerAddress[chainId] = [deployer];

  console.log("Storing fileToken address...");
  fs.writeFileSync(CONTRACT_ADDRESS_FILE, JSON.stringify(currentAddress));
  console.log("Stored!");

  console.log("Storing fileToken owner address...");
  fs.writeFileSync(
    CONTRACT_OWNER_ADDRESS_FILE,
    JSON.stringify(currentOwnerAddress)
  );
  console.log("Stored!");

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
