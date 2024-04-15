import Graceful from "@ladjs/graceful";

import { env } from "@/common/utils/envConfig";
import { app, logger } from "@/server";

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
  ],
});
graceful.listen();
