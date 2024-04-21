"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

export const addFundsFormSchema = z.object({
  amount: z.coerce.number().gt(0),
});

const defaultValues = {
  amount: "" as unknown as number, // Fix "uncontrolled component" error
};

type DialogProps = {
  dialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
  onSubmit: (values: z.infer<typeof addFundsFormSchema>) => void;
};

const AddFundsDialog: React.FC<DialogProps> = ({
  dialogOpen,
  setDialogOpen,
  onSubmit,
}) => {
  const form = useForm<z.infer<typeof addFundsFormSchema>>({
    resolver: zodResolver(addFundsFormSchema),
    defaultValues,
  });

  const { formState, handleSubmit } = form;
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
              <DialogTitle>Add Funds</DialogTitle>
              <DialogDescription>
                Send some ETH to the blob submission contract to be able to
                create new blobs
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="flex w-full flex-col gap-2">
                      <div className="group relative transition-opacity">
                        <Input
                          placeholder="Amount"
                          type="number"
                          disabled={isSubmitting}
                          className="bg-background/40 backdrop-blur-md"
                          {...field}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>In Gwei</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="submit" variant="secondary" disabled={isSubmitting}>
                Add Funds
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFundsDialog;
