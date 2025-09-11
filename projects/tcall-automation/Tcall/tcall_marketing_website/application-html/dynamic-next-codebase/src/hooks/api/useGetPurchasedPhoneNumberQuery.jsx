import { useQuery } from "@tanstack/react-query";
import { getPurchasedPhoneNumberAPI } from "../../services/admin/getPurchasedPhoneNumber";

export const useGetPurchasedPhoneNumberQuery = (searchParams) => {
  return useQuery({
    queryKey: ["purchasedPhoneNumber", searchParams],
    queryFn: () => getPurchasedPhoneNumberAPI(searchParams),
    onSuccess: (data) => {
      // You can handle success actions here if needed
      // For example, formatting the data or setting some state
      return data;
    },
    onError: (error) => {
      console.log(
        error.response?.data?.message ||
          "Failed to fetch purchased phone number. Please try again."
      );
    },
  });
};
