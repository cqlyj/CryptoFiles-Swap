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
    function tokenURI(uint256 _tokenId) external view returns (string memory);

    // Function to get the minting fee
    function getMintFee() external view returns (uint256);

    // Fucntion to get the file name
    function getFileName() external view returns (string memory);

    // Function to get the file symbol
    function getFileSymbol() external view returns (string memory);

    // Function to get the creator of the contract
    function creatorOfContract() external view returns (address);

    // Function for receiving Ether
    receive() external payable;

    // Function for fallback
    fallback() external payable;
}
