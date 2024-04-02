### How to ensure that the person listing an NFT is the actual owner of the file represented by the NFT?

- solution: check if the creator of fileToken is the one who call the listing function => add creatorOfContract function in fileToken contract.✅

### How to upgrade the marketplace?

- solution: proxy or diamond?

### How to charge the commission fee?

- solution: TBC

### How to refactor the buyFileToken so that it can take arbitrary tokens as payments? => Also set the mintFee in other currencies.

- solution: chainlink price feeds!