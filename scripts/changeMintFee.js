const { ethers, network } = require("hardhat");
const contractAddress = require("../constants/contractAddress.json");

async function changeMintFee() {
  const chainId = network.config.chainId;
  const fileTokenAddress = contractAddress[chainId][0];
  const fileTokenFactory = await ethers.getContractFactory("FileToken");
  const fileToken = fileTokenFactory.attach(fileTokenAddress);

  const newMintFee = ethers.parseEther("0.02");

  console.log("Changing Mint Fee to 0.02 ethers...");

  const tx = await fileToken.changeMintFee(newMintFee);
  await tx.wait();
  console.log(
    `Mint Fee changed to ${ethers.formatUnits(
      newMintFee
    )} ethers on chain ${chainId}`
  );
}

changeMintFee()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
