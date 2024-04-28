import {
  CommissionFeeChanged as CommissionFeeChangedEvent,
  FileTokenBought as FileTokenBoughtEvent,
  FileTokenListed as FileTokenListedEvent,
  FileTokenListingCancelled as FileTokenListingCancelledEvent,
  OwnerChanged as OwnerChangedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  ProceedsWithdrawn as ProceedsWithdrawnEvent
} from "../generated/FileMarketplace/FileMarketplace"
import {
  CommissionFeeChanged,
  FileTokenBought,
  FileTokenListed,
  FileTokenListingCancelled,
  OwnerChanged,
  OwnershipTransferred,
  ProceedsWithdrawn
} from "../generated/schema"

export function handleCommissionFeeChanged(
  event: CommissionFeeChangedEvent
): void {
  let entity = new CommissionFeeChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newCommissionFee = event.params.newCommissionFee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFileTokenBought(event: FileTokenBoughtEvent): void {
  let entity = new FileTokenBought(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.fileTokenOwner = event.params.fileTokenOwner
  entity.fileToken = event.params.fileToken
  entity.fileName = event.params.fileName
  entity.fileSymbol = event.params.fileSymbol
  entity.buyer = event.params.buyer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFileTokenListed(event: FileTokenListedEvent): void {
  let entity = new FileTokenListed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.fileTokenOwner = event.params.fileTokenOwner
  entity.fileToken = event.params.fileToken
  entity.fileName = event.params.fileName
  entity.fileSymbol = event.params.fileSymbol
  entity.price = event.params.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFileTokenListingCancelled(
  event: FileTokenListingCancelledEvent
): void {
  let entity = new FileTokenListingCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.fileTokenOwner = event.params.fileTokenOwner
  entity.fileToken = event.params.fileToken

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnerChanged(event: OwnerChangedEvent): void {
  let entity = new OwnerChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newFileMarketplaceOwner = event.params.newFileMarketplaceOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProceedsWithdrawn(event: ProceedsWithdrawnEvent): void {
  let entity = new ProceedsWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
