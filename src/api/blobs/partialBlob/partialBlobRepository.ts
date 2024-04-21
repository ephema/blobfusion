import { Hex } from "viem";

import { prisma } from "@/api/prisma/client";
import { getLengthWithExtraBytes } from "@/blob-fuser";

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
  createAsync: async (
    input: PartialBlobSubmission,
  ): Promise<{ id: number }> => {
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

    return { id };

    return convertPartialBlobInDBToPartialBlob(partialBlobInDB);
  },
  findAllAsync: async (): Promise<
    PartialBlobWithNullableDataAndSignature[]
  > => {
    const partialBlobsInDB = await prisma.partialBlob.findMany();
    return partialBlobsInDB.map(convertPartialBlobInDBToPartialBlob);
  },

  findAllUnfusedAsync: async ({ withDataAndSignature = true } = {}): Promise<
    PartialBlob[]
  > => {
    const partialBlobsInDB = await prisma.partialBlob.findMany({
      where: { fusedBlobId: null },
    });

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
      size: getLengthWithExtraBytes(partialBlob.data),
    }));
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
