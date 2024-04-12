const { deployments, ethers, network } = require("hardhat");
const { assert, expect } = require("chai");
const {
  developmentChains,
  networkConfig,
} = require("../../helper-hardhat-config");
const contractAddress = require("../../constants/fileMarketplaceAddress.json");
const fileTokenContractAddress = require("../../constants/fileTokenAddress.json");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FileMarketplace", () => {
      let accounts;
      let deployer;
      const chainId = network.config.chainId;
      const commissionFee = networkConfig[chainId].commissionFee;
      const fileTokenAddress = fileTokenContractAddress[chainId][0];
      const fileMarketplaceAddress = contractAddress[chainId][0];

      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["all"]); // allow to run different tags deployments in the same test

        const fileMarketplaceFactory = await ethers.getContractFactory(
          "FileMarketplace"
        );
        fileMarketplace = fileMarketplaceFactory.attach(fileMarketplaceAddress);

        const fileTokenFactory = await ethers.getContractFactory("FileToken");
        fileToken = fileTokenFactory.attach(fileTokenAddress);
      });

      describe("constructor", () => {
        it("should set the right owner", async () => {
          const owner = await fileMarketplace.owner();
          expect(owner).to.equal(deployer);
        });

        it("should set the right commission fee", async () => {
          const commissionFeeGet = await fileMarketplace.commissionFee();
          expect(commissionFee).to.equal(commissionFeeGet);
        });
      });

      describe("listFileToken", () => {
        it("only the fileToken owner can list the fileToken", async () => {
          await expect(
            fileMarketplace
              .connect(accounts[1])
              .listFileToken(fileTokenAddress, { value: commissionFee })
          ).to.be.revertedWithCustomError(
            fileMarketplace,
            "FileMarketplace__NotFileTokenCreator"
          );
        });

        it("only list if value is equal to or greater than the commission fee", async () => {
          await expect(
            fileMarketplace
              .connect(accounts[0])
              .listFileToken(fileTokenAddress, {
                value: commissionFee - BigInt(1),
              })
          ).to.be.revertedWithCustomError(
            fileMarketplace,
            "FileMarketplace__NotEnoughFee"
          );
        });
        it("only those fileToken notListed can be listed", async () => {
          await fileMarketplace
            .connect(accounts[0])
            .listFileToken(fileTokenAddress, { value: commissionFee });
          await expect(
            fileMarketplace
              .connect(accounts[0])
              .listFileToken(fileTokenAddress, { value: commissionFee })
          ).to.be.revertedWithCustomError(
            fileMarketplace,
            "FileMarketplace__FileTokenAlreadyListed"
          );
        });
        it("should emit a FileTokenListed event", async () => {
          await expect(
            fileMarketplace
              .connect(accounts[0])
              .listFileToken(fileTokenAddress, { value: commissionFee })
          )
            .to.emit(fileMarketplace, "FileTokenListed")
            .withArgs(
              accounts[0],
              fileTokenAddress,
              await fileToken.getFileName(),
              await fileToken.getFileSymbol(),
              await fileToken.getMintFee()
            );
        });
        it("should update the listing once is listed", async () => {
          await fileMarketplace
            .connect(accounts[0])
            .listFileToken(fileTokenAddress, { value: commissionFee });
          const listing = await fileMarketplace.getListing(
            deployer,
            fileTokenAddress
          );
          const fileName = listing.fileName;
          const fileSymbol = listing.fileSymbol;
          const price = listing.price;
          assert.equal(fileName, await fileToken.getFileName());
          assert.equal(fileSymbol, await fileToken.getFileSymbol());
          assert.equal(price, await fileToken.getMintFee());
        });
      });

      describe("cancelListing", () => {
        it("only listed fileToken can be canceled", async () => {
          await expect(
            fileMarketplace.connect(accounts[0]).cancelListing(fileTokenAddress)
          ).to.be.revertedWithCustomError(
            fileMarketplace,
            "FileMarketplace__FileTokenNotListed"
          );
        });
        it("only the fileToken creator can cancel the listing", async () => {
          await fileMarketplace
            .connect(accounts[0])
            .listFileToken(fileTokenAddress, { value: commissionFee });
          await expect(
            fileMarketplace.connect(accounts[1]).cancelListing(fileTokenAddress)
          ).to.be.revertedWithCustomError(
            fileMarketplace,
            "FileMarketplace__NotFileTokenCreator"
          );
        });
        it("should emit a FileTokenUnlisted event", async () => {
          await fileMarketplace
            .connect(accounts[0])
            .listFileToken(fileTokenAddress, { value: commissionFee });
          await expect(
            fileMarketplace.connect(accounts[0]).cancelListing(fileTokenAddress)
          )
            .to.emit(fileMarketplace, "FileTokenListingCancelled")
            .withArgs(accounts[0], fileTokenAddress);
        });
        it("should update the listing once is canceled", async () => {
          await fileMarketplace
            .connect(accounts[0])
            .listFileToken(fileTokenAddress, { value: commissionFee });
          await fileMarketplace
            .connect(accounts[0])
            .cancelListing(fileTokenAddress);
          const listing = await fileMarketplace.getListing(
            deployer,
            fileTokenAddress
          );
          assert.equal(listing.fileName, "");
          assert.equal(listing.fileSymbol, "");
          assert.equal(listing.price, 0);
        });
      });

      describe("buyFileToken", () => {
        it("only listed fileToken can be bought", async () => {
          await expect(
            fileMarketplace
              .connect(accounts[1])
              .buyFileToken(fileTokenAddress, { value: commissionFee })
          ).to.be.revertedWithCustomError(
            fileMarketplace,
            "FileMarketplace__FileTokenNotListed"
          );
        });
        it("should revert if the value is less than the price", async () => {
          await fileMarketplace
            .connect(accounts[0])
            .listFileToken(fileTokenAddress, { value: commissionFee });
          await expect(
            fileMarketplace
              .connect(accounts[1])
              .buyFileToken(fileTokenAddress, {
                value: commissionFee - BigInt(1),
              })
          ).to.be.revertedWithCustomError(
            fileMarketplace,
            "FileMarketplace__NotEnoughFee"
          );
        });
        it("should emit a FileTokenBought event", async () => {
          await fileMarketplace
            .connect(accounts[0])
            .listFileToken(fileTokenAddress, { value: commissionFee });
          await expect(
            fileMarketplace
              .connect(accounts[1])
              .buyFileToken(fileTokenAddress, {
                value: commissionFee,
              })
          )
            .to.emit(fileMarketplace, "FileTokenBought")
            .withArgs(
              accounts[0],
              fileTokenAddress,
              await fileToken.getFileName(),
              await fileToken.getFileSymbol(),
              accounts[1]
            );
        });
        it("should call the mint function of the fileToken contract", async () => {
          let tokenId = await fileToken.tokenId();
          assert.equal(tokenId, 0);
          await fileMarketplace
            .connect(accounts[0])
            .listFileToken(fileTokenAddress, { value: commissionFee });
          await fileMarketplace
            .connect(accounts[1])
            .buyFileToken(fileTokenAddress, { value: commissionFee });
          tokenId = await fileToken.tokenId();
          assert.equal(tokenId, 1);
        });
      });

      describe("changeCommissionFee", () => {
        it("only the owner can change the commission fee", async () => {
          await fileMarketplace
            .connect(deployer)
            .changeCommissionFee(ethers.parseEther("0.2"));

          const commissionFeeGet = await fileMarketplace.commissionFee();
          expect(ethers.formatEther(commissionFeeGet)).to.equal("0.2");

          await expect(
            fileMarketplace
              .connect(accounts[1])
              .changeCommissionFee(ethers.parseEther("0.2"))
          ).to.be.reverted;
        });
        it("should update the commission fee", async () => {
          await fileMarketplace
            .connect(accounts[0])
            .changeCommissionFee(ethers.parseEther("0.2"));
          const commissionFeeGet = await fileMarketplace.getCommissionFee();
          expect(ethers.formatEther(commissionFeeGet)).to.equal("0.2");
        });
        it("should emit a CommissionFeeChanged event", async () => {
          await expect(
            fileMarketplace
              .connect(deployer)
              .changeCommissionFee(ethers.parseEther("0.2"))
          )
            .to.emit(fileMarketplace, "CommissionFeeChanged")
            .withArgs(ethers.parseEther("0.2"));
        });
      });

      describe("withdrawCommissionFee", () => {
        it("only can be called when there is a balance", async () => {
          await expect(
            fileMarketplace.connect(deployer).withdrawCommissionFee()
          ).to.be.revertedWithCustomError(
            fileMarketplace,
            "FileMarketplace__NoProceedsForWithdraw"
          );
        });
        it("only can be called by the owner", async () => {
          await fileMarketplace
            .connect(accounts[0])
            .listFileToken(fileTokenAddress, { value: commissionFee });
          let balance = await ethers.provider.getBalance(
            fileMarketplace.target
          );
          assert.notEqual(balance, 0);
          await expect(
            fileMarketplace.connect(accounts[1]).withdrawCommissionFee()
          ).to.be.reverted;
          await fileMarketplace.connect(deployer).withdrawCommissionFee();
          balance = await ethers.provider.getBalance(fileMarketplace.target);
          assert.equal(balance, 0);
        });
        it("should emit a CommissionFeeWithdrawn event", async () => {
          await fileMarketplace
            .connect(accounts[0])
            .listFileToken(fileTokenAddress, { value: commissionFee });
          await expect(
            fileMarketplace.connect(deployer).withdrawCommissionFee()
          )
            .to.emit(fileMarketplace, "ProceedsWithdrawn")
            .withArgs(commissionFee);
        });
      });
      describe("changeOwner", () => {
        it("only the owner can change the owner", async () => {
          await expect(
            fileMarketplace
              .connect(accounts[1])
              .changeOwner(accounts[1].address)
          ).to.be.reverted;
        });
        it("should update the owner", async () => {
          await fileMarketplace
            .connect(deployer)
            .changeOwner(accounts[1].address);
          const owner = await fileMarketplace.owner();
          expect(owner).to.equal(accounts[1].address);
        });
        it("should emit a OwnerChanged event", async () => {
          await expect(
            fileMarketplace.connect(deployer).changeOwner(accounts[1].address)
          )
            .to.emit(fileMarketplace, "OwnerChanged")
            .withArgs(accounts[1].address);
        });
      });

      describe("getCommissionFee", () => {
        it("should return the commission fee", async () => {
          const commissionFeeGet = await fileMarketplace.getCommissionFee();
          expect(commissionFee).to.equal(commissionFeeGet);
        });
      });

      describe("getListing", () => {
        it("should return the listing", async () => {
          await fileMarketplace
            .connect(accounts[0])
            .listFileToken(fileTokenAddress, { value: commissionFee });
          const listing = await fileMarketplace.getListing(
            deployer,
            fileTokenAddress
          );
          assert.equal(listing.fileName, await fileToken.getFileName());
          assert.equal(listing.fileSymbol, await fileToken.getFileSymbol());
          assert.equal(listing.price, await fileToken.getMintFee());
        });
      });
    });
