import { PartialBlob } from "@/api/partialBlob/partialBlobModel";
import { partialBlobRepository } from "@/api/partialBlob/partialBlobRepository";
import { fusePartialBlobs } from "@/blob-fuser";
import { sendBlobTransaction } from "@/common/ethereum/sendBlobTransaction";

import { schedulerLogger } from "./logger";

// TODO: Add tests
export const fuseAndSendBlobs = async () => {
  schedulerLogger.info("Attempting to fuse and send new blob");

  const partialBlobs = await partialBlobRepository.findAllUnfusedAsync();

  schedulerLogger.info("%d unfused partial blobs found", partialBlobs.length);

  const blobsToFuse = getPotentialBlobConfiguration(partialBlobs);
  if (!blobsToFuse) {
    schedulerLogger.info(
      "Didn't find configuration to fuse partial blobs. Waiting for more blobs to be submitted",
    );
    return;
  }

  const fusedBlob = fusePartialBlobs(blobsToFuse);

  // TODO: Put this function in a new fusedBlobRepository
  // TODO: Also update fusedBlobPosition
  // TODO: Also update the name of the function to
  const fusedBlobId =
    await partialBlobRepository.createNewFusedBlobWithPartialBlobs(
      blobsToFuse.map((blob) => blob.id),
    );

  schedulerLogger.info("Created new fused blob with id %d", fusedBlobId);

  const txHash = await sendBlobTransaction({ data: fusedBlob });
  await partialBlobRepository.updateTxHashForFusedBlob(fusedBlobId, txHash);

  schedulerLogger.info("Fused blob tx submitted with txHash %d", txHash);

  return txHash;
};

// TODO
const getPotentialBlobConfiguration = (partialBlobs: PartialBlob[]) => {
  if (!canFuseBlobs(partialBlobs)) {
    return null;
  }

  return partialBlobs;
};

// TODO
const canFuseBlobs = (partialBlobs: PartialBlob[]) => {
  return partialBlobs.length >= 2;
};
