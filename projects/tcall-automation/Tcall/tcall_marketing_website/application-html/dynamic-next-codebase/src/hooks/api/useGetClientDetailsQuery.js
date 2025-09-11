import { useQuery } from "@tanstack/react-query";
import { getClientDetailsAPI } from "../../services/global/getClientDetailsAPI";

export const useClientDetailsQuery = () => {
  return useQuery({
    queryKey: ["clientDetails"],
    queryFn: getClientDetailsAPI,
    onSuccess: (data) => {
      // You can handle success actions here if needed
      // For example, formatting the data or setting some state
      return data;
    },
    onError: (error) => {
      console.log(
        error.response?.data?.message ||
          "Failed to fetch Client Details. Please try again."
      );
    }
  });
};
