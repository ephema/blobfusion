import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PartialBlob as PartialBlobType } from "@/lib/types";

import { PartialBlob } from "./PartialBlob";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";

const FusedBlobList: React.FC<{ blobs: PartialBlobType[] }> = ({ blobs }) => {
  const [accordionValue, setAccordionValue] = useState(`item-${blobs[0]?.id}`);
  const [prevBlobsLength, setPrevBlobsLength] = useState(blobs.length);
  useEffect(() => {
    if (blobs.length !== prevBlobsLength) {
      setPrevBlobsLength(blobs.length);
      setAccordionValue(`item-${blobs[0]?.id}`);
    }
  }, [blobs, prevBlobsLength]);
  return (
    <div className="flex-grow md:w-[650px]">
      <h1 className="text-1xl mb-4 font-bold">Fused Blobs</h1>
      <Accordion
        type="single"
        collapsible
        className="max-w-[650px] overflow-hidden rounded-sm"
        value={accordionValue}
        onValueChange={setAccordionValue}
      >
        <AnimatePresence mode="popLayout">
          {blobs.map(({ id, txHash, partialBlobs }) => (
            <motion.div
              key={`fusedblob-${id}`}
              layout
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <AccordionItem value={`item-${id}`} className="border-slate-600">
                <AccordionTrigger className="bg-slate-700/50 px-4 backdrop-blur-md">
                  <div className="max-w-80 overflow-hidden overflow-ellipsis">
                    {txHash ?? "Pending..."}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col items-center justify-center bg-slate-700/20 p-4">
                  <Link
                    href={`https://sepolia.blobscan.com/tx/${txHash}`}
                    target="_blank"
                  >
                    <Badge>View on Blobscan</Badge>
                  </Link>
                  <div className="flex flex-wrap justify-center gap-2 py-4 pl-4">
                    <LayoutGroup>
                      {partialBlobs.map((blob, index) => (
                        <motion.div
                          key={`blob-${blob.id}`}
                          layoutId={`blob-${blob.id}`}
                          layout
                          initial={{ opacity: 0, y: 25 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -25 }}
                          transition={{ duration: 0.6, type: "spring" }}
                        >
                          <PartialBlob
                            fromAddress={blob.fromAddress}
                            size={blob.size}
                            bidInGwei={blob.bidInGwei}
                          />
                        </motion.div>
                      ))}
                    </LayoutGroup>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </Accordion>
    </div>
  );
};

export default FusedBlobList;
