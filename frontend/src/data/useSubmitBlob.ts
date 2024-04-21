import { useMutation } from "@tanstack/react-query";

import { submitBlob } from "./api";
import { PartialBlobSubmission } from "./partialBlobSubmissionSchema";
import { queryClient } from "./queryClient";

export const useSubmitBlob = () =>
  useMutation({
    mutationFn: (data: PartialBlobSubmission) => submitBlob(data),
    // make sure to _return_ the Promise from the query invalidation
    // so that the mutation stays in `pending` state until the refetch is finished
    onSettled: async () => {
      console.log("onsettled");

      return await queryClient.invalidateQueries({ queryKey: ["blobs"] });
    },
  });
