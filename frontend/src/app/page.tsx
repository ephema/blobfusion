"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatEther, isAddress, parseEther, stringToHex } from "viem";
import {
  useAccount,
  useConnect,
  useSendTransaction,
  useSignMessage,
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
import { useLatestBlobs } from "@/data/useLatestBlobs";
import { useSubmitBlob } from "@/data/useSubmitBlob";
import { useUserBalance } from "@/data/useUserBalance";

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
  const { sendTransactionAsync } = useSendTransaction();
  const { chains, switchChainAsync } = useSwitchChain();
  const { signMessageAsync } = useSignMessage();

  const [newBlobDialogOpen, setNewBlobDialogOpen] = useState(false);
  const [addFundsDialogOpen, setAddFundsDialogOpen] = useState(false);

  const { data: userBalance, error } = useUserBalance({ address });
  const { data: blobs, error: blobsError } = useLatestBlobs();
  const { fusedBlobs = [], partialBlobs = [] } = blobs ?? {};
  const { mutateAsync: submitBlob } = useSubmitBlob();

  useEffect(() => {
    if (error) {
      console.log(error);
    }

    if (blobsError) {
      console.log(blobsError);
    }
  }, [error, blobsError]);

  const onSubmitAddFunds = async (
    values: z.infer<typeof addFundsFormSchema>,
  ) => {
    const { amount } = values;

    if (chainId !== chains[0].id) {
      // TODO fix TS
      //@ts-expect-error chainId is already known
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
    const { blobContents, bidInGwei } = values;

    const textInHex = stringToHex(blobContents);
    const signatureToast = toast.loading("Signing message...");
    const signature = await signMessageAsync({
      message: { raw: textInHex },
    });

    toast.dismiss(signatureToast);

    if (!address) {
      // TODO: Handle properly
      return;
    }

    const promise = submitBlob({
      data: textInHex,
      fromAddress: address,
      bidInGwei: BigInt(bidInGwei),
      signature,
    });

    toast.promise(promise, {
      loading: "Sending Blob...",
      success: () => {
        setNewBlobDialogOpen(false);
        return "Blob successfully sent";
      },
      error:
        "There was an error sending your blob. Please check the console for details.",
    });

    return promise;
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

        <BlobData fusedBlobs={fusedBlobs} partialBlobs={partialBlobs} />
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
