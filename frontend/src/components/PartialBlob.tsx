import { PartialBlob as PartialBlobType } from "@/lib/types";
import { Badge } from "./ui/badge";

export const PartialBlob: React.FC<PartialBlobType> = ({
  fromAddress,
  size,
  bid,
}) => (
  <div className="mx-2 flex flex-col gap-2 rounded-sm border border-blue-950 bg-blue-950/60 px-12 py-4 text-blue-100 shadow-sm backdrop-blur-md transition-colors hover:bg-blue-900/40">
    <div className="max-w-48 overflow-hidden overflow-ellipsis text-foreground">
      {fromAddress}
    </div>
    <div className="flex gap-2">
      <Badge variant="outline" className="border-blue-900">
        {size} bytes
      </Badge>
      <Badge variant="outline" className="border-blue-900">
        {bid} gwei
      </Badge>
    </div>
  </div>
);
