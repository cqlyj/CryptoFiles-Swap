const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const fs = require("fs-extra");
const {
  uploadToPinata,
  storeTokenURIMetadata,
} = require("../utils/uploadToPinata");

const chainId = network.config.chainId;

const fileName = networkConfig[chainId].fileName;
const fileSymbol = networkConfig[chainId].fileSymbol;
const mintFee = networkConfig[chainId].mintFee;

const testFilePath = "./constants/test/testFile.txt";
let fileTokenURI = "";
const metadataTemplate = {
  name: "",
  description: "",
  external_url: "",
};

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  if (process.env.UPLOAD_TO_PINATA === "true") {
    fileTokenURI = await handleFileTokenURI();
  } else {
    fileTokenURI = "test URI";
  }

  const args = [fileName, fileSymbol, fileTokenURI, mintFee];

  const fileToken = await deploy("FileToken", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  const CONTRACT_ADDRESS_FILE = "./constants/fileTokenAddress.json";

  const currentAddress = JSON.parse(
    fs.readFileSync(CONTRACT_ADDRESS_FILE),
    "utf-8"
  );
  currentAddress[chainId] = [fileToken.address];

  console.log("Storing fileToken address...");
  fs.writeFileSync(CONTRACT_ADDRESS_FILE, JSON.stringify(currentAddress));
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

async function handleFileTokenURI() {
  const res = await uploadToPinata(testFilePath);
  let fileTokenMetadata = { ...metadataTemplate };
  fileTokenMetadata.name = fileName;
  fileTokenMetadata.description = `This is a unique NFT representing file ${fileName}`;
  fileTokenMetadata.external_url = `https://ipfs.io/ipfs/${res.IpfsHash}`;
  const metadataRes = await storeTokenURIMetadata(fileTokenMetadata);
  fileTokenURI = `ipfs://${metadataRes.IpfsHash}`;
  console.log(`fileTokenURI uploaded, it's available at ${fileTokenURI}`);
  return fileTokenURI;
}

module.exports.tags = ["FileToken", "all"];
