"use client";

import { useState } from "react";
import { useAccount, useConnect } from "wagmi";

import Header from "@/components/Header";
import UserInfo from "@/components/UserInfo";
import BlobData from "@/components/BlobData";
import NewBlobDialog from "@/components/NewBlobDialog";
import AddFundsDialog from "@/components/AddFundsDialog";

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
      />

      <AddFundsDialog
        dialogOpen={addFundsDialogOpen}
        setDialogOpen={setAddFundsDialogOpen}
      />
    </>
  );
};

export default Home;
