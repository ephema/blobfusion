import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";

const UserInfo = () => {
  return (
    <Card className="min-w-[500px] bg-background/40 backdrop-blur-md">
      <CardContent className="mt-4 flex justify-between gap-2">
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-muted-foreground">Account</p>
            <h1 className="text-1xl font-bold text-foreground">
              0x14281...14281
            </h1>
          </div>
          <div>
            <p className="text-muted-foreground">Balance</p>
            <h1 className="text-2xl font-bold text-foreground">0.00 ETH</h1>
          </div>
        </div>
        <div className="flex w-36 flex-col justify-center gap-2">
          <Button variant="outline" className="bg-background/40">
            Add Funds
          </Button>
          <Button>New Blob</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
