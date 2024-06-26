// import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

import { userRepository } from "@/api/user/userRepository";
// import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";
import { getBlobGasPriceEstimate } from "@/ethereum/gas/getBlobGasPriceEstimate";
import { blobSubmitterPublicClient } from "@/ethereum/viemClients";

import { fusedBlobRepository } from "./fusedBlob/fusedBlobRepository";
import {
  GetPartialBlobSchema,
  PostPartialBlobSchema,
} from "./partialBlob/partialBlobModel";
import { partialBlobRepository } from "./partialBlob/partialBlobRepository";

// export const partialBlobRegistry = new OpenAPIRegistry();

// partialBlobRegistry.register("PartialBlob", PartialBlobSchema);

export const blobRouter: Router = (() => {
  const router = express.Router();

  // partialBlobRegistry.registerPath({
  //   method: "post",
  //   path: "/blobs",
  //   tags: ["PartialBlobs"],
  //   responses: createApiResponse(PartialBlobSchema, "Success"),
  // });

  router.get("/", async (_req: Request, res: Response) => {
    const [partialBlobs, fusedBlobs] = await Promise.all([
      partialBlobRepository.findAllUnfusedAsync({
        withDataAndSignature: false,
      }),
      fusedBlobRepository.findAllAsync({ withDataAndSignature: false }),
    ]);

    BigInt.prototype.toJSON = function () {
      return this.toString();
    };

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        partialBlobs,
        fusedBlobs,
      },
    });
  });

  router.post(
    "/",
    validateRequest(PostPartialBlobSchema),
    async (req: Request, res: Response) => {
      const { body } = PostPartialBlobSchema.parse(req);
      const { signature, data, fromAddress, bidInGwei } = body;

      const signatureIsValid = await blobSubmitterPublicClient.verifyMessage({
        address: fromAddress,
        message: { raw: data },
        signature,
      });

      if (!signatureIsValid) {
        res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "Signature is invalid",
          data: null,
        });

        return;
      }

      const userBalance = await userRepository.getBalance({
        address: fromAddress,
      });

      if (userBalance < bidInGwei) {
        res.status(StatusCodes.PAYMENT_REQUIRED).json({
          success: false,
          message: `Bid (${bidInGwei} gwei) was higher than available balance of ${userBalance} gwei`,
          data: null,
        });

        return;
      }

      const createdPartialBlob = await partialBlobRepository.createAsync(body);

      // @ts-expect-error BigInt is not serializable
      BigInt.prototype.toJSON = function () {
        return this.toString();
      };

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Blob created",
        data: createdPartialBlob,
      });
    },
  );

  router.get("/estimate-blob-price", async (req: Request, res: Response) => {
    const currentBlobGasPriceEstimate = await getBlobGasPriceEstimate();

    // @ts-expect-error BigInt is not serializable
    BigInt.prototype.toJSON = function () {
      return this.toString();
    };

    return res.status(StatusCodes.OK).json({
      success: true,
      data: currentBlobGasPriceEstimate,
    });
  });

  router.get(
    "/:id",
    validateRequest(GetPartialBlobSchema),
    async (req: Request, res: Response) => {
      const id = parseInt(req.params.id as string, 10);
      const partialBlob = await partialBlobRepository.findByIdAsync(id);

      if (!partialBlob) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          data: null,
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        data: partialBlob,
      });
    },
  );

  return router;
})();
