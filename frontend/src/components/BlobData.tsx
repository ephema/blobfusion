import FusedBlobList from "@/components/FusedBlobList";
import UnfusedBlobList from "@/components/UnfusedBlobList";
import { PartialBlob } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BlobDataProps {
  blobs: PartialBlob[];
}

const BlobData: React.FC<BlobDataProps> = ({ blobs }) => {
  return (
    <div
      className={cn(
        "flex max-w-full flex-col gap-8 lg:mt-8 lg:flex-row lg:gap-16",
      )}
    >
      <UnfusedBlobList blobs={blobs} />
      <FusedBlobList blobs={blobs} />
    </div>
  );
};

export default BlobData;
