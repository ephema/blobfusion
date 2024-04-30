import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import { Coins, Plus } from "lucide-react";

interface UserInfoProps {
  address?: string;
  isConnected: boolean;
  balance: string;
  onConnectWalletClick: React.MouseEventHandler<HTMLButtonElement>;
  onAddFundsClick: React.MouseEventHandler<HTMLButtonElement>;
  onNewBlobClick: React.MouseEventHandler<HTMLButtonElement>;
}

const UserInfo: React.FC<UserInfoProps> = ({
  address,
  isConnected,
  balance,
  onConnectWalletClick,
  onAddFundsClick,
  onNewBlobClick,
}) => {
  const placeholderAddress = "0x...";

  return (
    <Card className="w-[500px] max-w-full bg-background/40 backdrop-blur-md">
      <CardContent
        className={cn(
          "mt-4 flex justify-between gap-2",
          !isConnected && "blur-[2px]",
        )}
      >
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-muted-foreground">Account</p>
            <h1 className="text-1xl max-w-36 overflow-hidden overflow-ellipsis font-bold text-foreground sm:max-w-64">
              {isConnected ? address : placeholderAddress}
            </h1>
          </div>
          <div>
            <p className="text-muted-foreground">Balance</p>
            <h1 className="text-2xl font-bold text-foreground">{balance}</h1>
          </div>
        </div>
        <div className="flex w-36 flex-col justify-center gap-2">
          <Button
            variant="outline"
            className="bg-background/40"
            onClick={onAddFundsClick}
          >
            <Coins className="mr-2 h-4 w-4" />
            Add Funds
          </Button>
          <Button onClick={onNewBlobClick} disabled={balance === "0 GWEI"}>
            <Plus className="mr-2 h-4 w-4" />
            New Blob
          </Button>
        </div>
      </CardContent>

      {!isConnected && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-background/40">
          <Button onClick={onConnectWalletClick}>Connect Wallet</Button>
        </div>
      )}
    </Card>
  );
};

export default UserInfo;
