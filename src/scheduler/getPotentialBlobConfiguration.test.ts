import { Hex } from "viem";

import { PartialBlob } from "@/api/blobs/partialBlob/partialBlobModel";
import {
  BLOB_DATA_SIZE_LENGTH_IN_BYTES,
  HEX_MULTIPLIER,
  MAX_BLOB_SIZE_IN_BYTES,
  SIGNATURE_LENGTH_IN_BYTES,
} from "@/common/constants";

import { buildFusedBlobConfiguration } from "./getPotentialBlobConfiguration";

const makePartialBlobFixture = ({
  bidInGwei,
  dataLength = 100,
}: {
  bidInGwei: bigint;
  dataLength?: number;
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
  it("should include a partial blob with the maximum data length and minimum bid", () => {
    const partialBlob = makePartialBlobFixture({
      bidInGwei: 100n,
      dataLength:
        MAX_BLOB_SIZE_IN_BYTES -
        SIGNATURE_LENGTH_IN_BYTES -
        BLOB_DATA_SIZE_LENGTH_IN_BYTES,
    });

    expect(
      buildFusedBlobConfiguration({
        partialBlobs: [partialBlob],
        totalCostInGwei: 100n,
      }),
    ).toEqual([partialBlob]);
  });

  it("should not include a partial blob whose bid is too small", () => {
    expect(
      buildFusedBlobConfiguration({
        partialBlobs: [makePartialBlobFixture({ bidInGwei: 50n })],
        totalCostInGwei: 100n,
      }),
    ).toEqual([]);
  });

  it("should not include a partial blob that is too big", () => {
    expect(
      buildFusedBlobConfiguration({
        partialBlobs: [
          makePartialBlobFixture({
            bidInGwei: 100n,
            dataLength: MAX_BLOB_SIZE_IN_BYTES,
          }),
        ],
        totalCostInGwei: 100n,
      }),
    ).toEqual([]);
  });

  it("should include three blobs that have a high-enough bid", () => {
    const partialBlob = makePartialBlobFixture({
      bidInGwei: 100n,
      dataLength: 500,
    });

    const partialBlobs = [partialBlob, partialBlob, partialBlob];

    expect(
      buildFusedBlobConfiguration({
        partialBlobs,
        totalCostInGwei: 300n,
      }),
    ).toEqual(partialBlobs);
  });
  it("should include a subset of five blobs that are bigger than the maximum blob size", () => {
    const partialBlob = makePartialBlobFixture({
      bidInGwei: 100n,
      // each PartialBlob fills an exact quarter of a FusedBlob
      dataLength:
        MAX_BLOB_SIZE_IN_BYTES / 4 -
        SIGNATURE_LENGTH_IN_BYTES -
        BLOB_DATA_SIZE_LENGTH_IN_BYTES,
    });

    const partialBlobs = [
      partialBlob,
      partialBlob,
      partialBlob,
      partialBlob,
      partialBlob,
    ];

    const blobConfiguration = buildFusedBlobConfiguration({
      partialBlobs,
      totalCostInGwei: 400n,
    });

    expect(blobConfiguration.length).toBe(4);
    expect(blobConfiguration).toEqual(partialBlobs.slice(0, 4));
  });

  it("should return a configuration where partial blobs are removed whose bid is too small, but the others stay included", () => {
    const partialBlob = makePartialBlobFixture({ bidInGwei: 100n });

    const partialBlobWithTooSmallBid = makePartialBlobFixture({
      bidInGwei: 10n,
    });

    const partialBlobs = [
      partialBlob,
      partialBlob,
      partialBlob,
      partialBlob,
      partialBlobWithTooSmallBid,
    ];

    const blobConfiguration = buildFusedBlobConfiguration({
      partialBlobs,
      totalCostInGwei: 100n,
    });

    expect(blobConfiguration.length).toBe(4);
    expect(blobConfiguration).toEqual(partialBlobs.slice(0, 4));
  });

  it("should return a configuration where partial blobs are removed whose bid is too small, but the others stay included (2)", () => {
    const partialBlob1 = makePartialBlobFixture({ bidInGwei: 10n });
    const partialBlob2 = makePartialBlobFixture({ bidInGwei: 20n });
    const partialBlob3 = makePartialBlobFixture({ bidInGwei: 30n });
    const partialBlob4 = makePartialBlobFixture({ bidInGwei: 40n });
    const partialBlob5 = makePartialBlobFixture({ bidInGwei: 50n });

    const partialBlobs = [
      partialBlob1,
      partialBlob2,
      partialBlob3,
      partialBlob4,
      partialBlob5,
    ];

    const blobConfiguration = buildFusedBlobConfiguration({
      partialBlobs,
      totalCostInGwei: 90n,
    });

    expect(blobConfiguration.length).toBe(3);
    expect(blobConfiguration).toEqual(partialBlobs.slice(2, 5));
  });

  it("should return an empty configuration when the consecutive bids are too low", () => {
    // Even though there is a configuration here that would satisfy
    // sumOfBids < totalCostInGwei, the cost for each PartialBlob
    // is still higher than their bid because it is split based on dataLength
    const pBlob1 = makePartialBlobFixture({ bidInGwei: 10n, dataLength: 100 });
    const pBlob2 = makePartialBlobFixture({ bidInGwei: 20n, dataLength: 100 });
    const pBlob3 = makePartialBlobFixture({ bidInGwei: 30n, dataLength: 100 });
    const pBlob4 = makePartialBlobFixture({ bidInGwei: 40n, dataLength: 100 });
    const pBlob5 = makePartialBlobFixture({ bidInGwei: 50n, dataLength: 100 });

    const partialBlobs = [pBlob1, pBlob2, pBlob3, pBlob4, pBlob5];

    const blobConfiguration = buildFusedBlobConfiguration({
      partialBlobs,
      totalCostInGwei: 100n,
    });

    expect(blobConfiguration.length).toBe(0);
    expect(blobConfiguration).toEqual([]);
  });
});
