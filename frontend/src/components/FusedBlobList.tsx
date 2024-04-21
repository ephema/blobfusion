import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { PartialBlob } from "./PartialBlob";
import { PartialBlob as PartialBlobType } from "@/lib/types";

const tx = [
  "0x222d39Ec6bb596229938210a0D57E5C17f479495",
  "0x222d39Ec6bb596229938210a0D57E5C17f479495",
  "0x222d39Ec6bb596229938210a0D57E5C17f479495",
];
const FusedBlobList: React.FC<{ blobs: PartialBlobType[] }> = ({ blobs }) => (
  <div className="flex-grow md:w-[650px]">
    <h1 className="text-1xl mb-4 font-bold">Fused Blobs</h1>
    <Accordion
      type="single"
      collapsible
      className="max-w-[650px] overflow-hidden rounded-sm"
    >
      {tx.map((address, index) => (
        <AccordionItem
          value={`item-${index}`}
          className="border-slate-600"
          key={index}
        >
          <AccordionTrigger className="bg-slate-700/50 px-4 backdrop-blur-md">
            <div className="max-w-64 overflow-hidden overflow-ellipsis">
              {" "}
              {address}
            </div>
          </AccordionTrigger>
          <AccordionContent className="flex justify-center bg-slate-700/20 p-4">
            <div className="flex flex-wrap justify-center gap-2 py-4 pl-4">
              {blobs.slice(0, 3).map((blob, index) => (
                <PartialBlob
                  key={index}
                  fromAddress={blob.fromAddress}
                  size={blob.size}
                  bid={blob.bid}
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
