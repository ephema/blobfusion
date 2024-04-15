import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";

import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { userRouter } from "@/api/user/userRouter";
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { logger } from "@/common/logger";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";

import { partialBlobRouter } from "./api/partialBlob/partialBlobRouter";

const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

app.use(express.json());

// Request logging
app.use(requestLogger());

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/users", userRouter);
app.use("/blobs", partialBlobRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
