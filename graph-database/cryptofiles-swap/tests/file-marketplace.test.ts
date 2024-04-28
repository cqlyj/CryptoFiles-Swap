import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { CommissionFeeChanged } from "../generated/schema"
import { CommissionFeeChanged as CommissionFeeChangedEvent } from "../generated/FileMarketplace/FileMarketplace"
import { handleCommissionFeeChanged } from "../src/file-marketplace"
import { createCommissionFeeChangedEvent } from "./file-marketplace-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let newCommissionFee = BigInt.fromI32(234)
    let newCommissionFeeChangedEvent =
      createCommissionFeeChangedEvent(newCommissionFee)
    handleCommissionFeeChanged(newCommissionFeeChangedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CommissionFeeChanged created and stored", () => {
    assert.entityCount("CommissionFeeChanged", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CommissionFeeChanged",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newCommissionFee",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
