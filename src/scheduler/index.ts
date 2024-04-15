import { AsyncTask, SimpleIntervalJob, ToadScheduler } from "toad-scheduler";

import { fuseAndSendBlobs } from "./fuseAndSendBlobs";
import { schedulerLogger } from "./logger";

export const scheduler = new ToadScheduler();

const task = new AsyncTask("Fuse and send blobs", fuseAndSendBlobs, (err) => {
  schedulerLogger.error(err, "Error while executing fuse and send blob job");
});

const job = new SimpleIntervalJob({ seconds: 10 }, task, {
  preventOverrun: true,
});

scheduler.addSimpleIntervalJob(job);
