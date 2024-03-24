const { network, ethers } = require("hardhat");
const contractAddress = require("../constants/contractAddress.json");

async function withdraw() {
  const chainId = network.config.chainId;
  const fileTokenAddress = contractAddress[chainId][0];
  const fileTokenFactory = await ethers.getContractFactory("FileToken");
  const fileToken = fileTokenFactory.attach(fileTokenAddress);

  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  console.log("Withdrawing the balance...");

  const tx = await fileToken.withdraw();
  await tx.wait();
  console.log(
    `Balance withdrawn from contract on chain ${chainId} to ${deployer.address}`
  );
}

withdraw()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
