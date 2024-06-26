import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getLatestBlobs } from "./api";

export const useLatestBlobs = () => {
  return useQuery({
    queryKey: ["blobs"],
    queryFn: () => getLatestBlobs(),
    placeholderData: keepPreviousData,
    refetchInterval: 10000,
  });
};
