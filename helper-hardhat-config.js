const { ethers } = require("hardhat");

const networkConfig = {
  31337: {
    fileName: "FileToken",
    fileSymbol: "FT",
    mintFee: ethers.parseEther("0.01"),
    commissionFee: ethers.parseEther("0.01"),
  },
  11155111: {
    fileName: "FileToken",
    fileSymbol: "FT",
    mintFee: ethers.parseEther("0.01"),
    commissionFee: ethers.parseEther("0.01"),
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
};

const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

const developmentChains = ["hardhat", "localhost"];

module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
};
