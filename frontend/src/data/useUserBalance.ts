import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Hex } from "viem";

import { getUser } from "./api";

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
