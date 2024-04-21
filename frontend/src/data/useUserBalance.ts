import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { getUser } from "./api";
import { Hex } from "viem";

export const useUserBalance = ({ publicAddress }: { publicAddress: Hex }) => {
  return useQuery({
    queryKey: ["user", publicAddress],
    queryFn: () => getUser({ publicAddress }),
    select: (user) => user.balance,
    placeholderData: keepPreviousData,
  });
};
