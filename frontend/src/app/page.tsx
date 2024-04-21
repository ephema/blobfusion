"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  formatEther,
  formatGwei,
  isAddress,
  parseEther,
  parseGwei,
} from "viem";
import {
  useAccount,
  useConnect,
  useSendTransaction,
  useSwitchChain,
} from "wagmi";
import { z } from "zod";

import AddFundsDialog, {
  addFundsFormSchema,
} from "@/components/AddFundsDialog";
import BlobData from "@/components/BlobData";
import Header from "@/components/Header";
import NewBlobDialog, { newBlobFormSchema } from "@/components/NewBlobDialog";
import UserInfo from "@/components/UserInfo";
import { useUserBalance } from "@/data/useUserBalance";

const blobs = [
  {
    size: 1245,
    bid: 1238,
    fromAddress: "0x222d39Ec6bb596229938210a0D57E5C17f479495",
  },
  {
    size: 1245,
    bid: 1238,
    fromAddress: "0x222d39Ec6bb596229938210a0D57E5C17f479495",
  },
  {
    size: 1245,
    bid: 1238,
    fromAddress: "0x222d39Ec6bb596229938210a0D57E5C17f479495",
  },
  {
    size: 1245,
    bid: 1238,
    fromAddress: "0x222d39Ec6bb596229938210a0D57E5C17f479495",
  },
];

const DEPOSIT_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_DEPOSIT_CONTRACT_ADDRESS;

if (!DEPOSIT_CONTRACT_ADDRESS || !isAddress(DEPOSIT_CONTRACT_ADDRESS)) {
  throw new Error(
    "NEXT_PUBLIC_DEPOSIT_CONTRACT_ADDRESS needs to be an address in .env",
  );
}

const Home = () => {
  const { connectors, connect } = useConnect();
  const { address, isConnected, chainId } = useAccount();
  const [newBlobDialogOpen, setNewBlobDialogOpen] = useState(false);
  const [addFundsDialogOpen, setAddFundsDialogOpen] = useState(false);

  const { sendTransactionAsync } = useSendTransaction();
  const { chains, switchChainAsync } = useSwitchChain();

  const { data: userBalance, error } = useUserBalance({ address });

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  const onSubmitAddFunds = async (
    values: z.infer<typeof addFundsFormSchema>,
  ) => {
    const { amount } = values;

    if (chainId !== chains[0].id) {
      await switchChainAsync({ chainId: chains[0].id });
    }

    const promise = sendTransactionAsync({
      to: DEPOSIT_CONTRACT_ADDRESS,
      value: parseEther(amount.toString()),
    });

    toast.promise(promise, {
      loading: "Creating new transaction...",
      success: () => {
        setAddFundsDialogOpen(false);
        return "Transaction sent. Funds will be picked up in just a moment...";
      },
      error: "There was an error adding funds. Please try again.",
    });

    return promise;
  };

  async function onSubmitNewBlob(values: z.infer<typeof newBlobFormSchema>) {
    const promise = new Promise((resolve) => setTimeout(resolve, 2000));
    toast.promise(promise, {
      loading: "Sending Blob...",
      success: () => {
        return "Blob successfully sent";
      },
      error:
        "There was an error sending your blob. Please check the console for details.",
    });

    await promise;
    console.log(values);
  }

  return (
    <>
      <div className="mt-20 flex h-full flex-col items-center gap-4">
        <Header />
        <UserInfo
          isConnected={isConnected}
          address={address}
          balance={formatBalance(userBalance ?? 0n)}
          onAddFundsClick={() => setAddFundsDialogOpen(true)}
          onNewBlobClick={() => setNewBlobDialogOpen(true)}
          onConnectWalletClick={() => connect({ connector: connectors?.[0] })}
        />

        <BlobData blobs={blobs} />
      </div>

      <NewBlobDialog
        dialogOpen={newBlobDialogOpen}
        setDialogOpen={setNewBlobDialogOpen}
        onSubmit={onSubmitNewBlob}
      />

      <AddFundsDialog
        dialogOpen={addFundsDialogOpen}
        setDialogOpen={setAddFundsDialogOpen}
        onSubmit={onSubmitAddFunds}
      />
    </>
  );
};

const ETH_IN_GWEI = 1000000000n; // also GWEI_IN_WEI
const formatBalance = (balance: bigint) => {
  if (balance > ETH_IN_GWEI / 1000n) {
    return `${formatEther(balance, "gwei")
      .split(".")
      .map((str, i) => (i === 1 ? str.slice(0, 4) : str))
      .join(".")} ETH`;
  }
  return `${balance} GWEI`;
};

export default Home;
