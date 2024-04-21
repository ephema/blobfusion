import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";

import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import errorHandler from "@/common/middleware/errorHandler";
// import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";

import { blobRouter } from "./api/blobs/blobRouter";
import { userRouter } from "./api/user/userRouter";

const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
// TODO: Enable again
// app.use(rateLimiter);

app.use(express.json());

// Request logging
app.use(requestLogger());

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/blobs", blobRouter);
app.use("/users", userRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app };
