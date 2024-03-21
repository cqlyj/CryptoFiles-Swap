const { deployments, ethers } = require("hardhat");
const { assert, expect } = require("chai");
const {
  developmentChains,
  networkConfig,
} = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FileToken", () => {
      let fileToken;
      let deployer;
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        const { deploy } = deployments;
        await deployments.fixture(["all"]); // allow to run different tags deployments in the same test
        const chainId = network.config.chainId;
        const name = networkConfig[chainId].name;
        const symbol = networkConfig[chainId].symbol;

        let args = [name, symbol];

        fileToken = await deploy("FileToken", {
          from: deployer,
          args: args,
          log: true,
          waitConfirmations: network.config.blockConfirmations || 1,
        });
      });

      describe("constructor", () => {
        it("Should set the right name", async () => {});
      });
    });
