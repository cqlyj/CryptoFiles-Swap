import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  CommissionFeeChanged,
  FileTokenBought,
  FileTokenListed,
  FileTokenListingCancelled,
  OwnerChanged,
  OwnershipTransferred,
  ProceedsWithdrawn
} from "../generated/FileMarketplace/FileMarketplace"

export function createCommissionFeeChangedEvent(
  newCommissionFee: BigInt
): CommissionFeeChanged {
  let commissionFeeChangedEvent = changetype<CommissionFeeChanged>(
    newMockEvent()
  )

  commissionFeeChangedEvent.parameters = new Array()

  commissionFeeChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newCommissionFee",
      ethereum.Value.fromUnsignedBigInt(newCommissionFee)
    )
  )

  return commissionFeeChangedEvent
}

export function createFileTokenBoughtEvent(
  fileTokenOwner: Address,
  fileToken: Address,
  fileName: string,
  fileSymbol: string,
  buyer: Address
): FileTokenBought {
  let fileTokenBoughtEvent = changetype<FileTokenBought>(newMockEvent())

  fileTokenBoughtEvent.parameters = new Array()

  fileTokenBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "fileTokenOwner",
      ethereum.Value.fromAddress(fileTokenOwner)
    )
  )
  fileTokenBoughtEvent.parameters.push(
    new ethereum.EventParam("fileToken", ethereum.Value.fromAddress(fileToken))
  )
  fileTokenBoughtEvent.parameters.push(
    new ethereum.EventParam("fileName", ethereum.Value.fromString(fileName))
  )
  fileTokenBoughtEvent.parameters.push(
    new ethereum.EventParam("fileSymbol", ethereum.Value.fromString(fileSymbol))
  )
  fileTokenBoughtEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )

  return fileTokenBoughtEvent
}

export function createFileTokenListedEvent(
  fileTokenOwner: Address,
  fileToken: Address,
  fileName: string,
  fileSymbol: string,
  price: BigInt
): FileTokenListed {
  let fileTokenListedEvent = changetype<FileTokenListed>(newMockEvent())

  fileTokenListedEvent.parameters = new Array()

  fileTokenListedEvent.parameters.push(
    new ethereum.EventParam(
      "fileTokenOwner",
      ethereum.Value.fromAddress(fileTokenOwner)
    )
  )
  fileTokenListedEvent.parameters.push(
    new ethereum.EventParam("fileToken", ethereum.Value.fromAddress(fileToken))
  )
  fileTokenListedEvent.parameters.push(
    new ethereum.EventParam("fileName", ethereum.Value.fromString(fileName))
  )
  fileTokenListedEvent.parameters.push(
    new ethereum.EventParam("fileSymbol", ethereum.Value.fromString(fileSymbol))
  )
  fileTokenListedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return fileTokenListedEvent
}

export function createFileTokenListingCancelledEvent(
  fileTokenOwner: Address,
  fileToken: Address
): FileTokenListingCancelled {
  let fileTokenListingCancelledEvent = changetype<FileTokenListingCancelled>(
    newMockEvent()
  )

  fileTokenListingCancelledEvent.parameters = new Array()

  fileTokenListingCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "fileTokenOwner",
      ethereum.Value.fromAddress(fileTokenOwner)
    )
  )
  fileTokenListingCancelledEvent.parameters.push(
    new ethereum.EventParam("fileToken", ethereum.Value.fromAddress(fileToken))
  )

  return fileTokenListingCancelledEvent
}

export function createOwnerChangedEvent(
  newFileMarketplaceOwner: Address
): OwnerChanged {
  let ownerChangedEvent = changetype<OwnerChanged>(newMockEvent())

  ownerChangedEvent.parameters = new Array()

  ownerChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newFileMarketplaceOwner",
      ethereum.Value.fromAddress(newFileMarketplaceOwner)
    )
  )

  return ownerChangedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createProceedsWithdrawnEvent(
  amount: BigInt
): ProceedsWithdrawn {
  let proceedsWithdrawnEvent = changetype<ProceedsWithdrawn>(newMockEvent())

  proceedsWithdrawnEvent.parameters = new Array()

  proceedsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return proceedsWithdrawnEvent
}
