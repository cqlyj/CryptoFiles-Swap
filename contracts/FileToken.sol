// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FileToken is ERC721URIStorage, Ownable {
    //error
    error FileToken__MoreEthNeeded(uint256 requiredAmount, uint256 sentAmount);
    error FileToken__WithdrawFailed();
    error FileToken__NoBalanceForWithdraw();
    error FileToken__InvalidMintFee(uint256 newMintFee);

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
    }

    // functions

    function mintNFT(address _to) public payable {
        if (msg.value < mintFee) {
            revert FileToken__MoreEthNeeded(mintFee, msg.value);
        }
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, fileTokenURI);
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

    function getFileTokenURI() public view returns (string memory) {
        return fileTokenURI;
    }
}
