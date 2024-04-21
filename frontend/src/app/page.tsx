"use client";

import { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { z } from "zod";

import { toast } from "sonner";

import Header from "@/components/Header";
import UserInfo from "@/components/UserInfo";
import BlobData from "@/components/BlobData";
import NewBlobDialog, { newBlobFormSchema } from "@/components/NewBlobDialog";
import AddFundsDialog, {
  addFundsFormSchema,
} from "@/components/AddFundsDialog";

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

const Home = () => {
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();
  const [newBlobDialogOpen, setNewBlobDialogOpen] = useState(false);
  const [addFundsDialogOpen, setAddFundsDialogOpen] = useState(false);

  const onSubmitAddFunds = async (
    values: z.infer<typeof addFundsFormSchema>,
  ) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 2000));
    toast.promise(promise, {
      loading: "Creating new transaction...",
      success: () => {
        return "Transaction sent. Funds will be picked up in just a moment...";
      },
      error: "There was an error adding funds. Please try again.",
    });

    await promise;
    console.log(values);
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
          balance={0}
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

export default Home;
