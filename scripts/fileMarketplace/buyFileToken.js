const { network, ethers } = require("hardhat");
const contractAddress = require("../../constants/fileMarketplaceAddress.json");
const { networkConfig } = require("../../helper-hardhat-config");
const tokenOwnerAddress = require("../../constants/fileTokenOwnerAddress.json");

async function buyFileToken() {
  const chainId = network.config.chainId;
  const fileMarketplaceAddress = contractAddress[chainId][0];
  const fileMarketplaceFactory = await ethers.getContractFactory(
    "FileMarketplace"
  );
  const fileMarketplace = fileMarketplaceFactory.attach(fileMarketplaceAddress);
  const fileTokenOwnerAddress = tokenOwnerAddress[chainId][0];

  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  console.log("buying fileToken...");

  const tx = await fileMarketplace.buyFileToken(fileTokenOwnerAddress, {
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
