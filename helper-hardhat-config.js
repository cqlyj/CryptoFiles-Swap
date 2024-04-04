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
  },
};

const developmentChains = ["hardhat", "localhost"];

module.exports = {
  networkConfig,
  developmentChains,
};
