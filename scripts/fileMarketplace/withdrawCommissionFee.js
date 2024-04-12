const { network, ethers } = require("hardhat");
const contractAddress = require("../../constants/fileMarketplaceAddress.json");
const { networkConfig } = require("../../helper-hardhat-config");

async function withdrawCommissionFee() {
  const chainId = network.config.chainId;

  const fileMarketplaceAddress = contractAddress[chainId][0];
  const fileMarketplaceFactory = await ethers.getContractFactory(
    "FileMarketplace"
  );
  const fileMarketplace = fileMarketplaceFactory.attach(fileMarketplaceAddress);

  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  const proceedsBefore = await ethers.provider.getBalance(
    fileMarketplaceAddress
  );

  console.log(`proceedsBefore: ${proceedsBefore}`);

  console.log("Withdrawing commission fee...");

  const tx = await fileMarketplace.connect(deployer).withdrawCommissionFee();
  await tx.wait();

  const proceedsAfter = await ethers.provider.getBalance(
    fileMarketplaceAddress
  );

  console.log(`proceedsAfter: ${proceedsAfter}`);
  const proceeds = proceedsAfter - proceedsBefore;

  console.log(
    `fileMarketplace ${fileMarketplaceAddress} commission fee total up to ${proceeds} withdrawn by ${deployer.address}`
  );
}

withdrawCommissionFee()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
