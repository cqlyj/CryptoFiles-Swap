// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// This contract is for creating NFTs for files
// The owner need to sepecify the file name, file symbol, token URI and mint fee when deploying the contract -- from the front end deploy the contract
// The owner of the contract can mint NFTs for files and change the mint fee, withdraw the contract balance
// Those who want to mint NFTs for files need to pay the mint fee
// so that no need for the owner to mint multiple NFTs for sell, the owner can just deploy the contract and let others mint NFTs for files
// Only those who mint the NFT can call the getTokenURI function to get the token URI

contract FileToken is ERC721URIStorage, Ownable {
    //error
    error FileToken__MoreEthNeeded(uint256 requiredAmount, uint256 sentAmount);
    error FileToken__WithdrawFailed();
    error FileToken__NoBalanceForWithdraw();
    error FileToken__InvalidMintFee(uint256 newMintFee);
    error FileToken__TokenNotMinted();
    error FileToken__NotOwnerOfToken();

    //event
    event MintFeeChanged(uint256 newMintFee);
    event TokenMinted(
        address indexed to,
        uint256 indexed tokenId,
        string tokenURI
    );
    // variables

    uint256 public tokenId;
    uint256 public mintFee;
    string private fileTokenURI;
    string public fileName;
    string public fileSymbol;

    mapping(uint256 => bool) private mintedTokens;

    // constructor

    constructor(
        string memory _fileName,
        string memory _fileSymbol,
        string memory _tokenURI,
        uint256 _mintFee
    ) ERC721(_fileName, _fileSymbol) Ownable(msg.sender) {
        tokenId = 0;
        mintFee = _mintFee;
        fileTokenURI = _tokenURI;
        fileName = _fileName;
        fileSymbol = _fileSymbol;
        mintedTokens[tokenId] = false;
    }

    // functions

    function mintNFT(address _to) public payable {
        if (msg.value < mintFee) {
            revert FileToken__MoreEthNeeded(mintFee, msg.value);
        }
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, fileTokenURI);
        mintedTokens[tokenId] = true;
        emit TokenMinted(_to, tokenId, fileTokenURI);
        tokenId++;
    }

    function changeMintFee(uint256 newMintFee) public onlyOwner {
        if (newMintFee <= 0) {
            revert FileToken__InvalidMintFee(newMintFee);
        }
        mintFee = newMintFee;
        emit MintFeeChanged(newMintFee);
    }

    function withdraw() public onlyOwner {
        if (address(this).balance == 0) {
            revert FileToken__NoBalanceForWithdraw();
        }
        (bool success, ) = payable(owner()).call{value: address(this).balance}(
            ""
        );
        if (!success) {
            revert FileToken__WithdrawFailed();
        }
    }

    function getFileTokenURI(
        uint256 _tokenId
    ) public view returns (string memory) {
        if (mintedTokens[_tokenId] == false) {
            revert FileToken__TokenNotMinted();
        }
        if (ownerOf(_tokenId) != msg.sender) {
            revert FileToken__NotOwnerOfToken();
        }
        return fileTokenURI;
    }

    function creatorOfContract() public view returns (address) {
        return owner();
    }

    function getMintFee() public view returns (uint256) {
        return mintFee;
    }

    function getFileName() public view returns (string memory) {
        return fileName;
    }

    function getFileSymbol() public view returns (string memory) {
        return fileSymbol;
    }

    receive() external payable {
        mintNFT(msg.sender);
    }

    fallback() external payable {
        mintNFT(msg.sender);
    }
}
