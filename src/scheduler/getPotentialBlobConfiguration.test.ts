import { Hex } from "viem";

import { PartialBlob } from "@/api/partialBlob/partialBlobModel";
import { HEX_MULTIPLIER, MAX_BLOB_SIZE_IN_BYTES } from "@/common/constants";

import { buildFusedBlobConfiguration } from "./getPotentialBlobConfiguration";

const makePartialBlobFixture = ({
  bidInGwei,
  dataLength,
}: {
  bidInGwei: bigint;
  dataLength: number;
}): PartialBlob => {
  const data = `0x${"1".repeat(dataLength * HEX_MULTIPLIER)}` as Hex;
  return {
    data,
    bidInGwei,

    id: 1,
    signature: "0x12345",
    fromAddress: "0x12345",
    fusedBlobId: null,
    fusedBlobPosition: null,
    costInGwei: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

describe("buildFusedBlobConfiguration", () => {
  it("should fuse one partial blob that fills the entire fusedBlob and has a high-enough bid", () => {
    const partialBlob = makePartialBlobFixture({
      bidInGwei: 100n,
      dataLength: MAX_BLOB_SIZE_IN_BYTES / 2,
    });

    expect(
      buildFusedBlobConfiguration({
        partialBlobs: [partialBlob],
        totalTransactionCost: 100n,
      }),
    ).toEqual([partialBlob]);
  });
  it("should fuse three blobs that have a high-enough bid", () => {});
  it("should fuse five blobs that are bigger than the maximum blob size", () => {});
  it("should return a configuration where partial blobs are removed whose bid is too small, but the others stay included", () => {});
  it("should return a configuration where partial blobs are removed whose bid is too small, but the others stay included 2", () => {});
  it("should return an empty configuration when the bids are too low", () => {});
  it("should return an empty configuration when the bids are too low 2", () => {});
});
