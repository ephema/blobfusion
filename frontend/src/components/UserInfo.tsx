import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const UserInfo = () => {
  const isLoggedIn = false;
  const placeholderAddress = "0x12345...54321";
  const address = isLoggedIn ? "0x14281...14281" : placeholderAddress;
  const balance = "0.00";

  return (
    <Card className="w-[500px] max-w-full bg-background/40 backdrop-blur-md">
      <CardContent
        className={cn(
          "mt-4 flex justify-between gap-2",
          !isLoggedIn && "blur-[2px]",
        )}
      >
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-muted-foreground">Account</p>
            <h1 className="text-1xl font-bold text-foreground">{address}</h1>
          </div>
          <div>
            <p className="text-muted-foreground">Balance</p>
            <h1 className="text-2xl font-bold text-foreground">
              {balance} ETH
            </h1>
          </div>
        </div>
        <div className="flex w-36 flex-col justify-center gap-2">
          <Button variant="outline" className="bg-background/40">
            Add Funds
          </Button>
          <Button>New Blob</Button>
        </div>
      </CardContent>

      {!isLoggedIn && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-background/40">
          <Button>Connect Wallet</Button>
        </div>
      )}
    </Card>
  );
};

export default UserInfo;
