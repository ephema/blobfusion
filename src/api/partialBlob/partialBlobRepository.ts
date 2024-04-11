import { prisma } from "@/api/prisma/client";

import { PartialBlob, PartialBlobSubmission } from "./partialBlobModel";

export const partialBlobRepository = {
  createAsync: async (input: PartialBlobSubmission): Promise<PartialBlob> => {
    const { fromAddress, ...partialBlobData } = input;
    return prisma.partialBlob.create({
      data: {
        ...partialBlobData,
        owner: {
          connectOrCreate: {
            where: { address: fromAddress },
            create: { address: fromAddress },
          },
        },
      },
    });
  },
  findAllAsync: async (): Promise<PartialBlob[]> => {
    return prisma.partialBlob.findMany();
  },

  findByIdAsync: async (id: number): Promise<PartialBlob | null> => {
    return prisma.partialBlob.findUnique({ where: { id } });
  },
};
