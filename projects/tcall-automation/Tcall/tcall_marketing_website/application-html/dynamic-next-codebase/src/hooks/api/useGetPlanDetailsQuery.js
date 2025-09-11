import { useQuery } from "@tanstack/react-query";
import { getPlanDetailsAPI } from "../../services/customer/getPlanDetailsAPI";

export const usePlanDetailsQuery = () => {
  return useQuery({
    queryKey: ["pricing-planDetails"],
    queryFn: getPlanDetailsAPI,
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
    },
  });
};
