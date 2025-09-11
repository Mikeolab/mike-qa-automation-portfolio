import { useQuery } from "@tanstack/react-query";
import { getAdminStatisticsDetailsQueryAPI } from "../../services/admin/getAdminStatisticsDetailsQueryAPI";

export const useGetAdminStatisticsDetailsQuery = () => {
  console.log('query');
  
  return useQuery({
    queryKey: ["adminStatisticsDetails"],
    queryFn:getAdminStatisticsDetailsQueryAPI,
    onSuccess: (data) => {
      console.log({responseData : data})
      // You can handle success actions here if needed
      // For example, formatting the data or setting some state
      return data;
    },
    onError: (error) => {
      console.log(
        error.response?.data?.message ||
          "Failed to fetch Admin Statistics Details. Please try again."
      );
    }
  });
};
