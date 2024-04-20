import { PartialBlob, PartialBlobProps } from "./PartialBlob";

const UnfusedBlobList: React.FC<{ blobs: PartialBlobProps[] }> = ({
  blobs,
}) => (
  <div className="w-[600px] flex-grow">
    <h1 className="text-1xl mb-4 font-bold">Unfused Blobs</h1>
    <div className="flex flex-wrap gap-2">
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
