// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./interfaces/IFileToken.sol";

// import "@openzeppelin/contracts/access/AccessControl.sol";

// This contract is for file trading
// The owner of the file can list the fileToken for those who want to buy to mint the NFT for the file
// The owner of the file can also cancel the listing
// Provide an interface where users can see details about the file and mint NFTs directly from the `FileToken` contract by paying the minting fee.
// This contract can track the ownership and transaction history of each NFT minted from the `FileToken` contracts.
// This information can be used to display the history and provenance of each file token.
// This contract owner will earn a commission
// -> the owner of this contract can set the commission fee:
// -> the owner of this contract can withdraw the commission fee
// -> the owner of this contract can change the commission fee
// -> the owner of this contract can change the owner of the contract
// This contract only deployed by the marketplace owner
// Those fileToken owners can call the listFileToken function to list their fileToken contracts
// Those fileToken owners can call the cancelListing function to cancel the listing
// Only the owner of the marketplace can interact with other functions
// Many roles -> consider using OpenZeppelin's AccessControl(RBAC)

// RBAC: Role-Based Access Control: roles: TBC

contract FileMarketplace {
    struct Listing {
        address fileTokenOwner;
        address fileToken;
        string fileName;
        string fileSymbol;
        uint256 price;
    }

    error FileMarketplace__NotFileTokenCreator(address caller, address creator);
    error FileMarketplace__NotEnoughFee(uint256 fee, uint256 price);
    error FileMarketplace__InvalidCommissionFee(uint256 newCommissionFee);
    error FileMarketplace__NoProceedsForWithdraw();
    error FileMarketplace__WithdrawFailed();
    error FileMarketplace__BoughtFailed();
    error FileMarketplace__InvalidOwner(address newFileMarketplaceOwner);
    error FileMarketplace__FileTokenNotListed();

    event FileTokenListed(
        address indexed fileTokenOwner,
        address fileToken,
        string fileName,
        string fileSymbol,
        uint256 price
    );
    event FileTokenListingCancelled(
        address indexed fileTokenOwner,
        address fileToken
    );
    event FileTokenBought(
        address indexed fileTokenOwner,
        address fileToken,
        string fileName,
        string fileSymbol,
        address buyer
    );
    event CommissionFeeChanged(uint256 newCommissionFee);
    event ProceedsWithdrawn(uint256 amount);
    event OwnerChanged(address newFileMarketplaceOwner);

    address private fileMarketplaceOwner;
    uint256 public commissionFee; // how?

    mapping(address => Listing) private listings;

    constructor(uint256 _commissionFee) {
        fileMarketplaceOwner = msg.sender;
        commissionFee = _commissionFee;
    }

    function listFileToken(address fileTokenAddress) public payable {
        if (msg.sender != IFileToken(fileTokenAddress).creatorOfContract()) {
            revert FileMarketplace__NotFileTokenCreator(
                msg.sender,
                IFileToken(fileTokenAddress).creatorOfContract()
            );
        }

        if (commissionFee > msg.value) {
            revert FileMarketplace__NotEnoughFee(msg.value, commissionFee);
        }

        listings[msg.sender] = Listing({
            fileTokenOwner: msg.sender,
            fileToken: fileTokenAddress,
            fileName: IFileToken(fileTokenAddress).getFileName(),
            fileSymbol: IFileToken(fileTokenAddress).getFileSymbol(),
            price: IFileToken(fileTokenAddress).getMintFee()
        });

        emit FileTokenListed(
            msg.sender,
            fileTokenAddress,
            listings[msg.sender].fileName,
            listings[msg.sender].fileSymbol,
            listings[msg.sender].price
        );
    }

    function cancelListing(address fileTokenAddress) public {
        if (msg.sender != IFileToken(fileTokenAddress).creatorOfContract()) {
            revert FileMarketplace__NotFileTokenCreator(
                msg.sender,
                IFileToken(fileTokenAddress).creatorOfContract()
            );
        }

        delete listings[msg.sender];

        emit FileTokenListingCancelled(msg.sender, fileTokenAddress);
    }

    function buyFileToken(address fileTokenOwnerAddress) public payable {
        Listing memory listing = listings[fileTokenOwnerAddress];
        if (listing.fileToken == address(0)) {
            revert FileMarketplace__FileTokenNotListed();
        }
        if (listing.price > msg.value) {
            revert FileMarketplace__NotEnoughFee(msg.value, listing.price);
        }

        (bool success, ) = fileTokenOwnerAddress.call{value: listing.price}("");
        if (!success) {
            revert FileMarketplace__BoughtFailed();
        }

        IFileToken(listing.fileToken).mintNFT(msg.sender);

        emit FileTokenBought(
            fileTokenOwnerAddress,
            listing.fileToken,
            listing.fileName,
            listing.fileSymbol,
            msg.sender
        );
    }

    function changeCommissionFee(uint256 newCommissionFee) public {
        if (newCommissionFee < 0) {
            revert FileMarketplace__InvalidCommissionFee(newCommissionFee);
        }
        commissionFee = newCommissionFee;
        emit CommissionFeeChanged(newCommissionFee);
    }

    function withdrawCommissionFee() public payable {
        if (address(this).balance <= 0) {
            revert FileMarketplace__NoProceedsForWithdraw();
        }
        uint256 balance = address(this).balance;
        (bool success, ) = fileMarketplaceOwner.call{value: balance}("");
        if (!success) {
            revert FileMarketplace__WithdrawFailed();
        }
        emit ProceedsWithdrawn(balance);
    }

    function changeOwner(address newFileMarketplaceOwner) public {
        if (newFileMarketplaceOwner == address(0)) {
            revert FileMarketplace__InvalidOwner(newFileMarketplaceOwner);
        }
        fileMarketplaceOwner = newFileMarketplaceOwner;
        emit OwnerChanged(newFileMarketplaceOwner);
    }

    function getCommissionFee() public view returns (uint256) {
        return commissionFee;
    }

    receive() external payable {}

    fallback() external payable {}
}
