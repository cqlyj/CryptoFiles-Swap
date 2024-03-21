const { deployments, ethers } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FileToken", () => {
      let fileToken;
      let deployer;
      let accounts;
      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["all"]); // allow to run different tags deployments in the same test
        const FileToken = await ethers.getContractFactory("FileToken");
        fileToken = await FileToken.deploy();
      });

      describe("constructor", () => {
        it("should set the right mint fee", async () => {
          const mintFee = await fileToken.getMintFee();
          expect(mintFee).to.equal(ethers.parseEther("0.01"));
        });

        it("should set the right owner", async () => {
          const owner = await fileToken.owner();
          expect(owner).to.equal(deployer);
        });

        it("should set the right name and symbol", async () => {
          const name = await fileToken.name();
          const symbol = await fileToken.symbol();
          expect(symbol).to.equal("FT");
          expect(name).to.equal("FileToken");
        });

        it("should initialize the tokenId to 0", async () => {
          const tokenId = await fileToken.getTokenId();
          expect(tokenId).to.equal(0);
        });
      });

      describe("mintNFT", () => {
        it("should mint a new NFT", async () => {
          const mintFee = await fileToken.getMintFee();
          await fileToken.mintNFT(accounts[1], "example URI", {
            value: mintFee,
          });
          const tokenId = await fileToken.getTokenId();
          expect(tokenId).to.equal(1);
        });

        it("should emit a Mint event", async () => {
          const mintFee = await fileToken.getMintFee();
          await expect(
            fileToken.mintNFT(accounts[1], "example URI", {
              value: mintFee,
            })
          )
            .to.emit(fileToken, "TokenMinted")
            .withArgs(accounts[1], 0, "example URI");
        });
      });

      describe("changeMintFee", () => {
        it("should change the mint fee", async () => {
          const newFee = ethers.parseEther("0.02");
          await fileToken.changeMintFee(newFee);
          const mintFee = await fileToken.getMintFee();
          expect(mintFee).to.equal(newFee);
        });

        it("only the owner should be able to change the mint fee", async () => {
          const newFee = ethers.parseEther("0.02");
          await expect(fileToken.connect(accounts[1]).changeMintFee(newFee)).to
            .be.reverted;
        });

        it("should emit a MintFeeChanged event", async () => {
          const newFee = ethers.parseEther("0.02");
          await expect(fileToken.changeMintFee(newFee))
            .to.emit(fileToken, "MintFeeChanged")
            .withArgs(newFee);
        });
      });

      describe("withdraw", () => {
        it("should withdraw the contract balance", async () => {
          const mintFee = await fileToken.getMintFee();
          await fileToken.mintNFT(accounts[1], "example URI", {
            value: mintFee,
          });
          const balanceBefore = await ethers.provider.getBalance(
            deployer.address
          );
          await fileToken.withdraw();
          const balanceAfter = await ethers.provider.getBalance(
            deployer.address
          );
          expect(balanceAfter).to.be.gt(balanceBefore);
        });

        it("only the owner should be able to withdraw the contract balance", async () => {
          await expect(fileToken.connect(accounts[1]).withdraw()).to.be
            .reverted;
        });
      });
    });
