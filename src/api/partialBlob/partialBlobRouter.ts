// import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

// import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { validateRequest } from "@/common/utils/httpHandlers";

import { PostPartialBlobSchema } from "./partialBlobModel";
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
      data: partialBlobs,
    });
  });

  router.post(
    "/",
    validateRequest(PostPartialBlobSchema),
    async (req: Request, res: Response) => {
      const { body } = PostPartialBlobSchema.parse(req);
      const createdBlob = await partialBlobRepository.createAsync(body);

      res.status(StatusCodes.OK).json({
        success: true,
        data: createdBlob,
      });
    },
  );

  return router;
})();
