import { useQuery } from "@tanstack/react-query";
import { getCallHistoryPromptAPI } from "../../services/admin/getCallHistoryPromptAPI";

export const useGetCallHistoryPromptQuery = (searchParams, options = {}) => {
  return useQuery({
    queryKey: ["callHistoryPrompt", searchParams],
    queryFn: () => getCallHistoryPromptAPI(searchParams),
    // enabled: !!searchParams?.client_id,
    onSuccess: (data) => {
      // You can handle success actions here if needed
      // For example, formatting the data or setting some state
      return data;
    },
    onError: (error) => {
      console.log(
        error.response?.data?.message ||
          "Failed to fetch call history prompt. Please try again."
      );
    },
    ...options,
  });
};
