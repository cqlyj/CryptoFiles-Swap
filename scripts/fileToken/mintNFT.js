const { network, ethers } = require("hardhat");
const contractAddress = require("../../constants/contractAddress.json");
const { networkConfig } = require("../../helper-hardhat-config");

async function mintNFT() {
  const chainId = network.config.chainId;
  const fileTokenAddress = contractAddress[chainId][0];
  const fileTokenFactory = await ethers.getContractFactory("FileToken");
  const fileToken = fileTokenFactory.attach(fileTokenAddress);
  const mintFee = networkConfig[chainId].mintFee || ethers.parseEther("0.01");

  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  console.log("Minting NFT...");

  const tx = await fileToken.mintNFT(deployer.address, {
    value: mintFee,
  });
  await tx.wait();
  console.log(`NFT minted to ${deployer.address} on chain ${chainId}`);
}

mintNFT()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
