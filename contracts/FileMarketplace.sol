// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./interfaces/IFileToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

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

// ReentrancyGuard is needed to prevent reentrancy attack

contract FileMarketplace is Ownable, ReentrancyGuard {
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
    error FileMarketplace__ListFailed();
    error FileMarketplace__InvalidOwner(address newFileMarketplaceOwner);
    error FileMarketplace__FileTokenNotListed();
    error FileMarketplace__FileTokenAlreadyListed();

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
    uint256 public commissionFee;
    mapping(address => mapping(address => Listing)) private listings; // one owner can have multiple listings => fileTokenOwner => fileToken => Listing

    modifier isListed(address fileTokenOwnerAddress, address fileTokenAddress) {
        if (
            listings[fileTokenOwnerAddress][fileTokenAddress].fileToken ==
            address(0)
        ) {
            revert FileMarketplace__FileTokenNotListed();
        }
        _;
    }

    modifier isNotListed(
        address fileTokenOwnerAddress,
        address fileTokenAddress
    ) {
        if (
            listings[fileTokenOwnerAddress][fileTokenAddress].fileToken !=
            address(0)
        ) {
            revert FileMarketplace__FileTokenAlreadyListed();
        }
        _;
    }

    constructor(uint256 _commissionFee) Ownable(msg.sender) {
        fileMarketplaceOwner = msg.sender;
        commissionFee = _commissionFee;
    }

    function listFileToken(
        address fileTokenAddress
    )
        public
        payable
        isNotListed(
            IFileToken(payable(fileTokenAddress)).creatorOfContract(),
            fileTokenAddress
        )
        nonReentrant
    {
        if (
            msg.sender !=
            IFileToken(payable(fileTokenAddress)).creatorOfContract()
        ) {
            revert FileMarketplace__NotFileTokenCreator(
                msg.sender,
                IFileToken(payable(fileTokenAddress)).creatorOfContract()
            );
        }

        if (commissionFee > msg.value) {
            revert FileMarketplace__NotEnoughFee(msg.value, commissionFee);
        }

        (bool success, ) = fileMarketplaceOwner.call{value: commissionFee}("");
        if (!success) {
            revert FileMarketplace__ListFailed();
        }

        listings[msg.sender][fileTokenAddress] = Listing({
            fileTokenOwner: msg.sender,
            fileToken: fileTokenAddress,
            fileName: IFileToken(payable(fileTokenAddress)).getFileName(),
            fileSymbol: IFileToken(payable(fileTokenAddress)).getFileSymbol(),
            price: IFileToken(payable(fileTokenAddress)).getMintFee()
        });

        emit FileTokenListed(
            msg.sender,
            fileTokenAddress,
            listings[msg.sender][fileTokenAddress].fileName,
            listings[msg.sender][fileTokenAddress].fileSymbol,
            listings[msg.sender][fileTokenAddress].price
        );
    }

    function cancelListing(
        address fileTokenAddress
    )
        public
        isListed(
            IFileToken(payable(fileTokenAddress)).creatorOfContract(),
            fileTokenAddress
        )
    {
        if (
            msg.sender !=
            IFileToken(payable(fileTokenAddress)).creatorOfContract()
        ) {
            revert FileMarketplace__NotFileTokenCreator(
                msg.sender,
                IFileToken(payable(fileTokenAddress)).creatorOfContract()
            );
        }

        delete listings[msg.sender][fileTokenAddress];

        emit FileTokenListingCancelled(msg.sender, fileTokenAddress);
    }

    function buyFileToken(
        address fileTokenAddress
    )
        public
        payable
        isListed(
            IFileToken(payable(fileTokenAddress)).creatorOfContract(),
            fileTokenAddress
        )
        nonReentrant
    {
        Listing memory listing = listings[
            IFileToken(payable(fileTokenAddress)).creatorOfContract()
        ][fileTokenAddress];
        if (listing.price > msg.value) {
            revert FileMarketplace__NotEnoughFee(msg.value, listing.price);
        }

        // call the receive function of the fileToken contract and it will automatically mint the NFT
        (bool success, ) = payable(fileTokenAddress).call{value: msg.value}(
            abi.encodeWithSignature("mintNFT(address)", msg.sender)
        );
        if (!success) {
            revert FileMarketplace__BoughtFailed();
        }

        emit FileTokenBought(
            IFileToken(payable(fileTokenAddress)).creatorOfContract(),
            listing.fileToken,
            listing.fileName,
            listing.fileSymbol,
            msg.sender
        );
    }

    function changeCommissionFee(uint256 newCommissionFee) public onlyOwner {
        if (newCommissionFee < 0) {
            revert FileMarketplace__InvalidCommissionFee(newCommissionFee);
        }
        commissionFee = newCommissionFee;
        emit CommissionFeeChanged(newCommissionFee);
    }

    function withdrawCommissionFee() public payable onlyOwner {
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

    function changeOwner(address newFileMarketplaceOwner) public onlyOwner {
        if (newFileMarketplaceOwner == address(0)) {
            revert FileMarketplace__InvalidOwner(newFileMarketplaceOwner);
        }
        fileMarketplaceOwner = newFileMarketplaceOwner;
        emit OwnerChanged(newFileMarketplaceOwner);
    }

    function getCommissionFee() public view returns (uint256) {
        return commissionFee;
    }

    function getListing(
        address fileTokenOwner,
        address fileToken
    ) public view returns (Listing memory) {
        return listings[fileTokenOwner][fileToken];
    }

    receive() external payable {}

    fallback() external payable {}
}
