// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

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

}
