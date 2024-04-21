import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PartialBlob as PartialBlobType } from "@/lib/types";

import { PartialBlob } from "./PartialBlob";

const FusedBlobList: React.FC<{ blobs: PartialBlobType[] }> = ({ blobs }) => (
  <div className="flex-grow md:w-[650px]">
    <h1 className="text-1xl mb-4 font-bold">Fused Blobs</h1>
    <Accordion
      type="single"
      collapsible
      className="max-w-[650px] overflow-hidden rounded-sm"
    >
      {blobs.map(({ id, txHash, partialBlobs }) => (
        <AccordionItem
          value={`item-${id}`}
          className="border-slate-600"
          key={id}
        >
          <AccordionTrigger className="bg-slate-700/50 px-4 backdrop-blur-md">
            <div className="max-w-80 overflow-hidden overflow-ellipsis">
              {txHash ?? "Pending..."}
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex justify-center bg-slate-700/20 p-4">
            <div className="flex flex-wrap justify-center gap-2 py-4 pl-4">
              {partialBlobs.map((blob, index) => (
                <PartialBlob
                  key={index}
                  fromAddress={blob.fromAddress}
                  size={blob.size}
                  bidInGwei={blob.bidInGwei}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
);

export default FusedBlobList;
