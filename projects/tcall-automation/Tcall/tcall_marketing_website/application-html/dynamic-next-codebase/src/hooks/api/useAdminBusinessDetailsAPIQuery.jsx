import { useQuery } from "@tanstack/react-query";
import { getAdminBusinessDetailsAPI } from "../../services/admin/getAdminBusinessDetails";

export const useAdminBusinessDetailsAPIQuery = (businessId) => {
  return useQuery({
    queryKey: ["admin-businessDetails", businessId],
    queryFn: () => getAdminBusinessDetailsAPI(businessId),
    enabled: !!businessId,
    onSuccess: (data) => {
      // You can handle success actions here if needed
      // For example, formatting the data or setting some state
      return data;
    },
    onError: (error) => {
      console.log(
        error.response?.data?.message ||
          "Failed to fetch business details. Please try again."
      );
    },
  });
};
