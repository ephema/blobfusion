import "./ethereum/events/subscribeToDepositEvents";

import Graceful from "@ladjs/graceful";

import { logger } from "@/common/logger";
import { env } from "@/common/utils/envConfig";
import { app } from "@/server";

import { unsubscribeFromDepositEvents } from "./ethereum/events";
import { scheduler } from "./scheduler";

const server = app.listen(env.PORT, () => {
  const { NODE_ENV, HOST, PORT } = env;
  logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
});

const graceful = new Graceful({
  logger: logger,
  servers: [server],
  customHandlers: [
    () => {
      logger.info("Stopping scheduler");
      scheduler.stop();
    },
    () => {
      logger.info("Stopping event listener for deposits");
      unsubscribeFromDepositEvents();
    },
  ],
});
graceful.listen();
