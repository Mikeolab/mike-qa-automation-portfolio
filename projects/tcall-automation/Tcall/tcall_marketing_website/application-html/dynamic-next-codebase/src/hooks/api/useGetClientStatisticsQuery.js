import { useQuery } from "@tanstack/react-query";
import { getClientStatisticsQueryAPI } from "../../services/customer/getClientStatisticsQueryAPI";

export const useGetClientStatisticsQuery = () => {
  return useQuery({
    queryKey: ["getClientStatisticsQuery"],
    queryFn: getClientStatisticsQueryAPI,
    onSuccess: (data) => {
      // You can handle success actions here if needed
      // For example, formatting the data or setting some state
      return data;
    },
    onError: (error) => {
      console.log(
        error.response?.data?.message ||
          "Failed to fetch Client statistics Details. Please try again."
      );
    }
  });
};
