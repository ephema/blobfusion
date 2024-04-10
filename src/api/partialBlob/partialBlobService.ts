import { StatusCodes } from "http-status-codes";

import {
  ResponseStatus,
  ServiceResponse,
} from "@/common/models/serviceResponse";
import { logger } from "@/server";

import { PartialBlob, PartialBlobSubmission } from "./partialBlobModel";
import { partialBlobRepository } from "./partialBlobRepository";

export const partialBlobService = {
  findAll: async (): Promise<ServiceResponse<PartialBlob[] | null>> => {
    try {
      const partialBlobs = await partialBlobRepository.findAllAsync();
      if (!partialBlobs) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          "No partial blobs found",
          null,
          StatusCodes.NOT_FOUND,
        );
      }
      return new ServiceResponse<PartialBlob[]>(
        ResponseStatus.Success,
        "partial blobs found",
        partialBlobs,
        StatusCodes.OK,
      );
    } catch (ex) {
      const errorMessage = `Error finding all partial blobs: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(
        ResponseStatus.Failed,
        errorMessage,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  },

  create: async (
    input: PartialBlobSubmission,
  ): Promise<ServiceResponse<PartialBlob | null>> => {
    const response = await partialBlobRepository.createAsync(input);
    return new ServiceResponse(
      ResponseStatus.Success,
      "Partial Blob created",
      response,
      StatusCodes.OK,
    );
  },
};
