import { useQuery } from "@tanstack/react-query";
import { getClientBusinessListAPI } from "../../services/admin/getClientBusinessList";

export const useGetClientBusinessListQuery = (searchParams) => {
  return useQuery({
    queryKey: ["clientBusinessList", searchParams],
    queryFn: () => getClientBusinessListAPI(searchParams),
    onSuccess: (data) => {
      // You can handle success actions here if needed
      // For example, formatting the data or setting some state
      return data;
    },
    onError: (error) => {
      console.log(
        error.response?.data?.message ||
          "Failed to fetch client business list. Please try again."
      );
    },
  });
};
