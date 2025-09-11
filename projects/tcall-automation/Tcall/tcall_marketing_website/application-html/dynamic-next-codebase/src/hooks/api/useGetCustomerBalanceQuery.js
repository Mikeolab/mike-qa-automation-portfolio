import { useQuery } from "@tanstack/react-query";
import { getCustomerBalanceQueryAPI } from "../../services/customer/getCustomerBalanceQueryAPI";

export const useGetCustomerBalanceQuery = () => {
  return useQuery({
    queryKey: ["planDetails"],
    queryFn: getCustomerBalanceQueryAPI,
    onSuccess: (data) => {
      // You can handle success actions here if needed
      // For example, formatting the data or setting some state
      return data;
    },
    onError: (error) => {
      console.log(
        error.response?.data?.message ||
          "Failed to fetch Plan Details. Please try again."
      );
    }
  });
};
