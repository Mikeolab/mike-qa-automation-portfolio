import { useQuery } from "@tanstack/react-query";
import { getPurchasedPhoneNumberAPI } from "../../services/admin/getPurchasedPhoneNumber";
import { getAdminPurchasePhoneNumberAPI } from "../../services/admin/getAdminPurchasePhoneNumber";

export const useGetAdminPurchaseNumberQuery = (searchParams) => {
  return useQuery({
    queryKey: ["purchasePhoneNumber", searchParams],
    queryFn: () => getAdminPurchasePhoneNumberAPI(searchParams),
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
