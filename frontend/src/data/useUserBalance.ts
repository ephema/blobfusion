import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { getUser } from "./api";
import { Hex } from "viem";

export const useUserBalance = ({ address }: { address?: Hex }) => {
  return useQuery({
    queryKey: ["user", address],
    queryFn: () => getUser({ address }),
    select: (user) => user.balanceInGwei,
    placeholderData: keepPreviousData,
    enabled: !!address,
    refetchInterval: 5000,
  });
};
