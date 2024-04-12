const { network, ethers } = require("hardhat");
const contractAddress = require("../../constants/fileMarketplaceAddress.json");
const { networkConfig } = require("../../helper-hardhat-config");
const tokenAddress = require("../../constants/fileTokenAddress.json");

async function listFileToken() {
  const chainId = network.config.chainId;
  const fileMarketplaceAddress = contractAddress[chainId][0];
  const fileMarketplaceFactory = await ethers.getContractFactory(
    "FileMarketplace"
  );
  const fileMarketplace = fileMarketplaceFactory.attach(fileMarketplaceAddress);
  const fileTokenAddress = tokenAddress[chainId][0];

  const commissionFee = await fileMarketplace.commissionFee();

  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  console.log("Listing fileToken...");

  const tx = await fileMarketplace.listFileToken(fileTokenAddress, {
    value: commissionFee,
  });
  await tx.wait();
  console.log(
    `FileToken ${fileTokenAddress} listed on ${fileMarketplaceAddress} on chain ${chainId}`
  );
}

listFileToken()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
