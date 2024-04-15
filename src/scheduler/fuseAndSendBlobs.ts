import { PartialBlob } from "@/api/partialBlob/partialBlobModel";
import { partialBlobRepository } from "@/api/partialBlob/partialBlobRepository";
import { fusePartialBlobs } from "@/blob-fuser";
import { sendBlobTransaction } from "@/common/ethereum/sendBlobTransaction";
import { logger } from "@/server";

// TODO: Add tests
export const fuseAndSendBlobs = async () => {
  logger.info("Fusing and sending blob");

  const partialBlobs = await partialBlobRepository.findAllUnfusedAsync();
  const blobsToFuse = getPotentialBlobConfiguration(partialBlobs);

  if (!blobsToFuse) {
    logger.info("No blobs to fuse, waiting for more blobs to be submitted");
    return;
  }

  const fusedBlob = fusePartialBlobs(blobsToFuse);

  // TODO: Put this function in a new fusedBlobRepository
  // TODO: Also update fusedBlobPosition
  const fusedBlobId = await partialBlobRepository.markAsFused(
    blobsToFuse.map((blob) => blob.id),
  );

  const txHash = await sendBlobTransaction({ data: fusedBlob });

  await partialBlobRepository.updateTxHashForFusedBlob(fusedBlobId, txHash);
};

// TODO
const getPotentialBlobConfiguration = (partialBlobs: PartialBlob[]) => {
  if (!canFuseBlobs(partialBlobs)) {
    logger.info("No blobs to fuse, waiting for more blobs to be submitted");
    return;
  }

  return partialBlobs;
};

// TODO
const canFuseBlobs = (partialBlobs: PartialBlob[]) => {
  return partialBlobs.length >= 2;
};
