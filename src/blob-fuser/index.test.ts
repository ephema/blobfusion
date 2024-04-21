import { PartialBlob } from "@/api/blobs/partialBlob/partialBlobModel";

import { fusePartialBlobs, getDataLengthInHex, unfuseFusedBlob } from "./index";

const partialBlobFixtures: PartialBlob[] = [
  {
    id: 9,
    bidInGwei: 4n,
    signature:
      "0x21fbf0696d5e0aa2ef41a2b4ffb623bcaf070461d61cf7251c74161f82fec3a4370854bc0a34b3ab487c1bc021cd318c734c51ae29374f2beb0e6f2dd49b4bf41c",
    data: "0x1234567890abcdef", // Assumption: data always represents bytes as a hex string => 0x + even number of hex chars
    fromAddress: "0xd90027769915dce53278204189E77705075DC4d2",
    fusedBlobId: null,
    fusedBlobPosition: null,
    costInGwei: null,
    createdAt: new Date("2024-04-12T13:38:00.453Z"),
    updatedAt: new Date("2024-04-12T13:38:00.453Z"),
  },
  {
    id: 10,
    bidInGwei: 4n,
    signature:
      "0x1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
    data: "0x22222222222222222222222222",
    fromAddress: "0x837B7Dacc88c2E5316Dfb5C7B51b98eEf9e12DA0",
    fusedBlobId: null,
    fusedBlobPosition: null,
    costInGwei: null,
    createdAt: new Date("2024-04-12T13:39:39.285Z"),
    updatedAt: new Date("2024-04-12T13:39:39.285Z"),
  },
];

const hexPrefix = "0x";
const firstFusedBlob = [
  partialBlobFixtures[0].signature.slice(2),
  "000008",
  partialBlobFixtures[0].data.slice(2),
].join("");

const secondFusedBlob = [
  partialBlobFixtures[1].signature.slice(2),
  "00000d",
  partialBlobFixtures[1].data.slice(2),
].join("");

describe("blob-fuser", () => {
  describe("fusePartialBlobs", () => {
    it("should fuse first blob correctly", () => {
      const fusedBlob = fusePartialBlobs(partialBlobFixtures.slice(0, 1));
      expect(fusedBlob).toBeTypeOf("string");
      expect(fusedBlob).toBe(`${hexPrefix}${firstFusedBlob}`);
    });

    it("should fuse second blob correctly", () => {
      const fusedBlob = fusePartialBlobs(partialBlobFixtures.slice(1, 2));
      expect(fusedBlob).toBeTypeOf("string");
      expect(fusedBlob).toBe(`${hexPrefix}${secondFusedBlob}`);
    });

    it("should fuse two blobs correctly", () => {
      const fusedBlob = fusePartialBlobs(partialBlobFixtures);
      expect(fusedBlob).toBeTypeOf("string");
      expect(fusedBlob).toBe(`${hexPrefix}${firstFusedBlob}${secondFusedBlob}`);
    });
  });

  describe("unfuseFusedBlob", () => {
    it("should unfuse first blob correctly", () => {
      expect(unfuseFusedBlob(`${hexPrefix}${firstFusedBlob}`)).toEqual([
        {
          signature: partialBlobFixtures[0].signature,
          data: partialBlobFixtures[0].data,
        },
      ]);
    });

    it("should unfuse second blob correctly", () => {
      expect(unfuseFusedBlob(`${hexPrefix}${secondFusedBlob}`)).toEqual([
        {
          signature: partialBlobFixtures[1].signature,
          data: partialBlobFixtures[1].data,
        },
      ]);
    });

    it("should unfuse two blobs correctly", () => {
      expect(
        unfuseFusedBlob(`${hexPrefix}${firstFusedBlob}${secondFusedBlob}`),
      ).toEqual([
        {
          signature: partialBlobFixtures[0].signature,
          data: partialBlobFixtures[0].data,
        },
        {
          signature: partialBlobFixtures[1].signature,
          data: partialBlobFixtures[1].data,
        },
      ]);
    });
  });

  describe("getDataLengthInHex", () => {
    it("should return the correct length of a piece of data in hex", () => {
      expect(getDataLengthInHex("0x1234567890abcdef")).toBe("0x000008");
    });

    it("should return the correct length of a piece of data and pad it to 3 bytes (6 hex chars)", () => {
      expect(getDataLengthInHex("0x00")).toBe("0x000001");
    });
  });

  it("should fuse and then unfuse a single blob", () => {
    const [partialBlob] = partialBlobFixtures;
    const fusedBlob = fusePartialBlobs([partialBlob]);
    const unfusedBlob = unfuseFusedBlob(fusedBlob);
    expect(unfusedBlob).toEqual([
      {
        signature: partialBlob.signature,
        data: partialBlob.data,
      },
    ]);
  });

  it("should fuse and then unfuse multiple blobs", () => {
    const [partialBlob1, partialBlob2] = partialBlobFixtures;
    const fusedBlob = fusePartialBlobs(partialBlobFixtures);
    const unfusedBlob = unfuseFusedBlob(fusedBlob);
    expect(unfusedBlob).toEqual([
      {
        signature: partialBlob1.signature,
        data: partialBlob1.data,
      },
      {
        signature: partialBlob2.signature,
        data: partialBlob2.data,
      },
    ]);
  });
});
