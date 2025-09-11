import { useQuery } from "@tanstack/react-query";
import { getCallHistoryAPI } from "../../services/admin/getCallHistoryAPI";

export const useGetCallHistoryQuery = (searchParams, options = {}) => {
  return useQuery({
    queryKey: ["callHistory", searchParams],
    queryFn: () => getCallHistoryAPI(searchParams),
    onSuccess: (data) => {
      // You can handle success actions here if needed
      // For example, formatting the data or setting some state
      return data;
    },
    onError: (error) => {
      console.log(
        error.response?.data?.message ||
          "Failed to fetch call history. Please try again."
      );
    },
    ...options,
  });
};
