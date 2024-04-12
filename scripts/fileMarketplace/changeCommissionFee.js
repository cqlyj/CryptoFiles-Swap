const { network, ethers } = require("hardhat");
const contractAddress = require("../../constants/fileMarketplaceAddress.json");
const { networkConfig } = require("../../helper-hardhat-config");

async function changeCommissionFee() {
  const chainId = network.config.chainId;

  const fileMarketplaceAddress = contractAddress[chainId][0];
  const fileMarketplaceFactory = await ethers.getContractFactory(
    "FileMarketplace"
  );
  const fileMarketplace = fileMarketplaceFactory.attach(fileMarketplaceAddress);

  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  const newCommissionFee = ethers.parseEther("0.02");
  const commissionFeeBefore = await fileMarketplace.commissionFee();
  console.log("the origin commission fee is: ", commissionFeeBefore);

  console.log("Changing commission fee...");

  const tx = await fileMarketplace
    .connect(deployer)
    .changeCommissionFee(newCommissionFee);
  await tx.wait();

  const commissionFeeAfter = await fileMarketplace.commissionFee();
  console.log(
    `fileMarketplace ${fileMarketplaceAddress} commission fee changed from ${commissionFeeBefore} to ${commissionFeeAfter}`
  );
}

changeCommissionFee()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
