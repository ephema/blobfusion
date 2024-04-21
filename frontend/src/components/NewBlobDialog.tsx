"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "sonner";

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
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  blobContents: z.string().min(2).max(50),
  bidInGwei: z.coerce.number().positive().min(1).int(),
});

const defaultValues = {
  blobContents: "",
  bidInGwei: "" as unknown as number, // Fix "uncontrolled component" error
};

type DialogProps = {
  dialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
};

const NewBlobDialog: React.FC<DialogProps> = ({
  dialogOpen,
  setDialogOpen,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { formState, handleSubmit } = form;
  const { isSubmitting } = formState;

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
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
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                  <FormDescription>Your bid in Gwei</FormDescription>
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
