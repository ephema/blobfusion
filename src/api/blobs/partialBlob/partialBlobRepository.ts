import { Hex } from "viem";

import { prisma } from "@/api/prisma/client";

import {
  convertHexToBuffer,
  convertPartialBlobInDBToPartialBlob,
} from "./convertPartialBlobInDBToPartialBlob";
import { PartialBlob, PartialBlobSubmission } from "./partialBlobModel";

type PartialBlobWithNullableDataAndSignature = Omit<
  PartialBlob,
  "data" | "signature"
> & {
  data: Hex | null;
  signature: Hex | null;
};
export const partialBlobRepository = {
  createAsync: async (input: PartialBlobSubmission): Promise<PartialBlob> => {
    const { fromAddress, data, ...partialBlobData } = input;

    const partialBlobInDB = await prisma.partialBlob.create({
      data: {
        ...partialBlobData,
        data: convertHexToBuffer(data),
        owner: {
          connectOrCreate: {
            where: { address: fromAddress },
            create: { address: fromAddress },
          },
        },
      },
    });

    return convertPartialBlobInDBToPartialBlob(partialBlobInDB);
  },
  findAllAsync: async ({ withDataAndSignature = true } = {}): Promise<
    PartialBlobWithNullableDataAndSignature[]
  > => {
    const partialBlobsInDB = await prisma.partialBlob.findMany();
    const partialBlobs = partialBlobsInDB.map(
      convertPartialBlobInDBToPartialBlob,
    );

    if (withDataAndSignature) {
      return partialBlobs;
    }

    return partialBlobs.map((partialBlob) => ({
      ...partialBlob,
      data: null,
      signature: null,
    }));
  },

  findAllUnfusedAsync: async (): Promise<PartialBlob[]> => {
    const partialBlobsInDB = await prisma.partialBlob.findMany({
      where: { fusedBlobId: null },
    });
    return partialBlobsInDB.map(convertPartialBlobInDBToPartialBlob);
  },

  findByIdAsync: async (id: number): Promise<PartialBlob | null> => {
    const partialBlobInDB = await prisma.partialBlob.findUnique({
      where: { id },
    });

    if (!partialBlobInDB) {
      return null;
    }

    return convertPartialBlobInDBToPartialBlob(partialBlobInDB);
  },
};
