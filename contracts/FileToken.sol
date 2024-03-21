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

    uint256 private tokenId;
    uint256 private mintFee;

    // constructor

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) Ownable(msg.sender) {
        tokenId = 0;
        mintFee = 0.01 ether;
    }

    // functions

    function mintNFT(address _to, string memory _tokenURI) public payable {
        if (msg.value < mintFee) {
            revert FileToken__MoreEthNeeded(mintFee, msg.value);
        }
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        emit TokenMinted(_to, tokenId, _tokenURI);
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

    function getMintFee() public view returns (uint256) {
        return mintFee;
    }

    function gettokenId() public view returns (uint256) {
        return tokenId;
    }
}
