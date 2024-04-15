import { AsyncTask, SimpleIntervalJob, ToadScheduler } from "toad-scheduler";

import { logger } from "@/server";

import { fuseAndSendBlobs } from "./fuseAndSendBlobs";

export const scheduler = new ToadScheduler();

const task = new AsyncTask("Fuse and send blobs", fuseAndSendBlobs, (err) => {
  logger.error(err, "Error while executing fuse and send blob job");
});

const job = new SimpleIntervalJob({ seconds: 10 }, task, {
  preventOverrun: true,
});

scheduler.addSimpleIntervalJob(job);
