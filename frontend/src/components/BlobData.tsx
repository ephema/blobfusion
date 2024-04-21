import FusedBlobList from "@/components/FusedBlobList";
import UnfusedBlobList from "@/components/UnfusedBlobList";
import { PartialBlob } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BlobDataProps {
  partialBlobs: PartialBlob[];
  fusedBlobs: PartialBlob[];
}

const BlobData: React.FC<BlobDataProps> = ({ partialBlobs, fusedBlobs }) => {
  return (
    <div
      className={cn(
        "flex max-w-full flex-col gap-8 lg:mt-8 lg:flex-row lg:gap-16",
      )}
    >
      <UnfusedBlobList blobs={partialBlobs} />
      <FusedBlobList blobs={fusedBlobs} />
    </div>
  );
};

export default BlobData;
