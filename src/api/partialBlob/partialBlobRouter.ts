// import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Request, Response, Router } from "express";

// import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";

import { PostPartialBlobSchema } from "./partialBlobModel";
import { partialBlobService } from "./partialBlobService";

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
    const serviceResponse = await partialBlobService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  router.post(
    "/",
    validateRequest(PostPartialBlobSchema),
    async (req: Request, res: Response) => {
      const { body } = PostPartialBlobSchema.parse(req);
      const serviceResponse = await partialBlobService.create(body);
      handleServiceResponse(serviceResponse, res);
    },
  );

  return router;
})();
