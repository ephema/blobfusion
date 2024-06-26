"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "./ui/textarea";
import { getRandomBlobText } from "@/lib/getRandomBlobText";
import { RandomBlobButton } from "./RandomBlobButton";
import { useEstimatedBlobCost } from "@/data/useEstimatedBlobCost";

export const newBlobFormSchema = z.object({
  blobContents: z.string().min(2),
  bidInGwei: z.coerce.number().positive().min(1).int(),
});

const defaultValues = {
  blobContents: "",
  bidInGwei: "" as unknown as number, // Fix "uncontrolled component" error
};

type DialogProps = {
  dialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
  onSubmit: (values: z.infer<typeof newBlobFormSchema>) => void;
};

const ETH_IN_GWEI = 1000000000n; // TODO: move to central place
const NewBlobDialog: React.FC<DialogProps> = ({
  dialogOpen,
  setDialogOpen,
  onSubmit,
}) => {
  const { data: estimatedBlobCost } = useEstimatedBlobCost();
  const form = useForm<z.infer<typeof newBlobFormSchema>>({
    resolver: zodResolver(newBlobFormSchema),
    defaultValues,
  });

  const { formState, handleSubmit, setValue } = form;
  const { isSubmitting } = formState;

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => setDialogOpen(isSubmitting ? true : open)}
    >
      <DialogContent className="sm:max-w-lg">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Create Blob</DialogTitle>
              <DialogDescription>
                Create a blob directly from your browser
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="blobContents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blob Contents</FormLabel>
                  <FormControl>
                    <div className="flex w-full flex-col gap-2">
                      <div className="group relative transition-opacity">
                        <Textarea
                          placeholder="Create and send a fresh blob directly from your browser..."
                          disabled={isSubmitting}
                          className="min-h-40 bg-background/40 backdrop-blur-md"
                          {...field}
                        />
                        <RandomBlobButton
                          disabled={isSubmitting}
                          onClick={() => {
                            setValue(field.name, getRandomBlobText());
                          }}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bidInGwei"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bid</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="42"
                      min="0"
                      disabled={isSubmitting}
                      className="bg-background/40 backdrop-blur-md"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your bid in Gwei{" "}
                    {estimatedBlobCost ? (
                      <>
                        (Full blob currently costs{" "}
                        {String(
                          (estimatedBlobCost * BigInt(2 ** 17)) / ETH_IN_GWEI,
                        )}{" "}
                        gwei)
                      </>
                    ) : null}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="submit" variant="secondary" disabled={isSubmitting}>
                Sign and Create Blob
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewBlobDialog;

// Form needs
// blob content (just a string of hex data for now, maybe add a dropdown later for own input)
// bid (number) => propose something that is in line with the current blobgas price from the server
// and that is also smaller than the deposit
