const { network, ethers } = require("hardhat");
const contractAddress = require("../../constants/fileTokenAddress.json");

async function mintNFT() {
  const chainId = network.config.chainId;
  const fileTokenAddress = contractAddress[chainId][0];
  const fileTokenFactory = await ethers.getContractFactory("FileToken");
  const fileToken = fileTokenFactory.attach(fileTokenAddress);

  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  console.log("Getting NFT tokenURI...");

  const tx = await fileToken.connect(deployer).tokenURI(0);

  console.log(`tokenURI is ${tx}`);
}

mintNFT()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
