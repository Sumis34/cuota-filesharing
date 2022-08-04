import axios from "axios";
import { useMutation } from "../utils/trpc";

export default function usePreviewPrefetchMutation() {
  const getPreviewUrlsMutation = useMutation(["files.getPreviewUrls"], {
    onSuccess: async (data) => {
      for (const url of data.urls) {
        console.log("fetching preview url");
        await axios.get(url);
      }
    },
  });

  return {
    prefetchPreviewUrls: getPreviewUrlsMutation.mutate,
  };
}
