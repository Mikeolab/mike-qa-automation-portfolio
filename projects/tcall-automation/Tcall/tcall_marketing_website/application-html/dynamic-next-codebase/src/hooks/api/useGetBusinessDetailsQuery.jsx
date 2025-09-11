import { useQuery } from "@tanstack/react-query";
import { getBusinessDetailsAPI } from "../../services/customer/getBusinessDetails";

export const useGetBusinessDetailsQuery = () => {
  return useQuery({
    queryKey: ["businessDetails"],
    queryFn: getBusinessDetailsAPI,
    onSuccess: (data) => {
      // You can handle success actions here if needed
      // For example, formatting the data or setting some state
      return data;
    },
    onError: (error) => {
      console.log(
        error.response?.data?.message ||
          "Failed to fetch client types. Please try again."
      );
    },
  });
};
