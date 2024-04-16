### 1. Contract Deployment
- The file owner deploys the `FileToken` contract, specifying the file name, symbol, token URI (likely a link to the file's metadata on IPFS), and the minting fee.

### 2. Listing on the Marketplace
- The file owner (or anyone with the right permissions) lists the `FileToken` contract on the `FileMarketplace`.
- The marketplace records this listing, allowing users to discover and mint NFTs from this `FileToken` contract.

### 3. User Interaction
- Users browse the `FileMarketplace` to find files they are interested in.
- Once a user decides to mint an NFT (buy the file), they interact with the `FileMarketplace`, which directs them to the specific `FileToken` contract.

### 4. Minting NFTs
- The user mints the NFT directly from the `FileToken` contract by paying the specified minting fee. This fee stays in the contract for the owner to withdraw later.
- The `FileToken` contract assigns a new NFT to the user, incrementing the `tokenId` and marking it as minted.

### 5. Commission Fees
- The `FileMarketplace` charges a commission fee on each listing transaction. This fee is collected in the `FileMarketplace` contract and can be withdrawn by the marketplace owner.

### 6. After Minting
- The user now owns the NFT representing the file and can view the token URI to access the file's metadata and potentially the file itself.
- The `FileMarketplace` can track the history of minted NFTs, showing provenance, and facilitating secondary sales if needed. (TBC or update in later version)

### 7. Withdrawal of Fees
- The file owner can withdraw the minting fees collected in the `FileToken` contract.
- The marketplace owner can withdraw the commission fees collected in the `FileMarketplace` contract.

### Workflow Summary:
1. **File Owner**: Deploys `FileToken` and lists it on the marketplace.
2. **User**: Finds the file on the marketplace, mints the NFT by paying the fee.
3. **File Owner**: Withdraws minting fees from `FileToken`.
4. **Marketplace Owner**: Withdraws commission fees from `FileMarketplace`.
