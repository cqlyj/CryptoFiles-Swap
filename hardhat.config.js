require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SEPOLIA_ETHERSCAN_API_KEY = process.env.SEPOLIA_ETHERSCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{ version: "0.8.24" }, { version: "0.6.12" }],
  },
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6,
    },
  },
  gasReporter: {
    enabled: true,
  },
  etherscan: {
    apiKey: SEPOLIA_ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
  },
};
