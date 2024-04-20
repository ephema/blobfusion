import UnfusedBlobList from "@/components/UnfusedBlobList";
import UserInfo from "@/components/UserInfo";

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

export default function Home() {
  return (
    <div className="mt-20 flex h-full flex-col items-center gap-4">
      <div className="mb-4 text-center">
        <h1 className="mb-2 bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          <span className="text-white">🌀</span> BlobFusion
        </h1>
        <p className="mb-1 text-muted-foreground">
          Making blob space{" "}
          <b className="bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 bg-clip-text">
            affordable
          </b>{" "}
          for everyone ✨
        </p>
      </div>

      <UserInfo />

      <div className="mt-8 flex min-h-full flex-grow gap-16">
        <UnfusedBlobList blobs={blobs} />
        <div className="mt-16 h-full min-h-96 flex-grow border-l border-purple-300/30"></div>
        <UnfusedBlobList blobs={blobs} />
      </div>
    </div>
  );
}
