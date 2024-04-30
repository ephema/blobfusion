import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Hex } from "viem";

import { getEstimatedBlobCost } from "./api";

export const useEstimatedBlobCost = () => {
  return useQuery({
    queryKey: ["blob-cost"],
    queryFn: () => getEstimatedBlobCost(),
    placeholderData: keepPreviousData,
    refetchInterval: 2500,
  });
};
