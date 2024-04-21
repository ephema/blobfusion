import { PartialBlob } from "./PartialBlob";
import { PartialBlob as PartialBlobType } from "@/lib/types";

const UnfusedBlobList: React.FC<{ blobs: PartialBlobType[] }> = ({ blobs }) => (
  <div className="w-full flex-grow">
    <h1 className="text-1xl mb-4 font-bold">Unfused Blobs</h1>
    <div className="flex flex-col flex-wrap gap-2 lg:flex-row">
      {blobs.map((blob, index) => (
        <PartialBlob
          key={index}
          fromAddress={blob.fromAddress}
          size={blob.size}
          bid={blob.bid}
        />
      ))}
    </div>
  </div>
);

export default UnfusedBlobList;
