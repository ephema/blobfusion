import { AnimatePresence, motion } from "framer-motion";

import { PartialBlob as PartialBlobType } from "@/lib/types";

import { PartialBlob } from "./PartialBlob";

const UnfusedBlobList: React.FC<{ blobs: PartialBlobType[] }> = ({ blobs }) => (
  <div className="w-full flex-grow">
    <h1 className="text-1xl mb-4 font-bold">Unfused Blobs</h1>
    <div className="flex flex-col flex-wrap gap-2 lg:flex-row">
      <AnimatePresence mode="popLayout">
        {blobs.map((blob) => (
          <motion.div
            key={`blob-${blob.id}`}
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
      </AnimatePresence>
    </div>
  </div>
);

export default UnfusedBlobList;
