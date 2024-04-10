import { PartialBlob, PartialBlobSubmission } from "./partialBlobModel";

export const partialBlobs: PartialBlob[] = [
  {
    id: 1,
    bid: 1,
    signature: "signature",
    data: "data",
    fromAddress: "fromAddress",
    createdAt: new Date(),
    includedIn: null,
    positionInFusedBlob: null,
    cost: null,
  },
  {
    id: 2,
    bid: 2,
    signature: "signature",
    data: "data",
    fromAddress: "fromAddress",
    createdAt: new Date(),
    includedIn: null,
    positionInFusedBlob: null,
    cost: null,
  },
];

export const partialBlobRepository = {
  createAsync: async (input: PartialBlobSubmission): Promise<PartialBlob> => {
    const nextId = partialBlobs.length + 1;
    const partialBlob = {
      id: nextId,
      createdAt: new Date(),
      includedIn: null,
      positionInFusedBlob: null,
      cost: null,
      ...input,
    };

    partialBlobs.push(partialBlob);
    return partialBlob;
  },
  findAllAsync: async (): Promise<PartialBlob[]> => {
    return partialBlobs;
  },

  findByIdAsync: async (id: number): Promise<PartialBlob | null> => {
    return partialBlobs.find((partialBlob) => partialBlob.id === id) || null;
  },
};
