// import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { isAddress } from "viem";

import { userRepository } from "@/api/user/userRepository";

export const userRouter: Router = (() => {
  const router = express.Router();

  router.get("/:address", async (_req: Request, res: Response) => {
    const { address } = _req.params;

    if (!isAddress(address)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid address",
      });
    }

    const balance = await userRepository.getBalance({ address });

    BigInt.prototype.toJSON = function () {
      return this.toString();
    };

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        address,
        balanceInGwei: balance,
      },
    });
  });

  return router;
})();
