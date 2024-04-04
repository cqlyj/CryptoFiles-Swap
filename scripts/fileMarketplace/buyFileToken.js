const { network, ethers } = require("hardhat");
const contractAddress = require("../../constants/fileMarketplaceAddress.json");
const { networkConfig } = require("../../helper-hardhat-config");
const tokenAddress = require("../../constants/fileTokenAddress.json");

async function buyFileToken() {
  const chainId = network.config.chainId;
  const fileMarketplaceAddress = contractAddress[chainId][0];
  const fileMarketplaceFactory = await ethers.getContractFactory(
    "FileMarketplace"
  );
  const fileMarketplace = fileMarketplaceFactory.attach(fileMarketplaceAddress);
  const fileTokenAddress = tokenAddress[chainId][0];

  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  console.log("buying fileToken...");

  const tx = await fileMarketplace.buyFileToken(fileTokenAddress, {
    value: networkConfig[chainId].mintFee,
  });
  await tx.wait();
  console.log(`Mint fileToken on chain ${chainId}`);
}

buyFileToken()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
