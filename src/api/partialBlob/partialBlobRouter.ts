// import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

// import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";

import { convertDataFieldBufferToHex } from "./convertDataFieldBufferToHex";
import {
  GetPartialBlobSchema,
  PostPartialBlobSchema,
} from "./partialBlobModel";
import { partialBlobRepository } from "./partialBlobRepository";

// export const partialBlobRegistry = new OpenAPIRegistry();

// partialBlobRegistry.register("PartialBlob", PartialBlobSchema);

export const partialBlobRouter: Router = (() => {
  const router = express.Router();

  // partialBlobRegistry.registerPath({
  //   method: "post",
  //   path: "/blobs",
  //   tags: ["PartialBlobs"],
  //   responses: createApiResponse(PartialBlobSchema, "Success"),
  // });

  router.get("/", async (_req: Request, res: Response) => {
    const partialBlobs = await partialBlobRepository.findAllAsync();

    return res.status(StatusCodes.OK).json({
      success: true,
      data: partialBlobs.map((partialBlob) =>
        convertDataFieldBufferToHex(partialBlob),
      ),
    });
  });

  router.post(
    "/",
    validateRequest(PostPartialBlobSchema),
    async (req: Request, res: Response) => {
      const { body } = PostPartialBlobSchema.parse(req);
      const createdPartialBlob = await partialBlobRepository.createAsync(body);

      res.status(StatusCodes.OK).json({
        success: true,
        data: convertDataFieldBufferToHex(createdPartialBlob),
      });
    },
  );

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
        data: convertDataFieldBufferToHex(partialBlob),
      });
    },
  );

  return router;
})();
