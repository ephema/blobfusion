import Header from "@/components/Header";

import UserInfo from "@/components/UserInfo";
import BlobData from "@/components/BlobData";

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
  return (
    <div className="mt-20 flex h-full flex-col items-center gap-4">
      <Header />

      <UserInfo />

      <BlobData blobs={blobs} />
    </div>
  );
};

export default Home;
