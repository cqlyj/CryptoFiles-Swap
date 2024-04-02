// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IFileToken {
    // Function to mint an NFT for a file
    function mintNFT(address _to) external payable;

    // Function to change the minting fee
    function changeMintFee(uint256 newMintFee) external;

    // Function to withdraw the contract's balance
    function withdraw() external;

    // Function to get the token URI of a minted NFT
    function getFileTokenURI(
        uint256 _tokenId
    ) external view returns (string memory);

    // Function to get the creator of the contract
    function creatorOfContract() external view returns (address);
}
