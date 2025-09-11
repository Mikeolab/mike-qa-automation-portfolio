import { useQuery } from "@tanstack/react-query";
import { getClientTypesAPI } from "../../services/global/getClientTypesAPI";

export const useGetClientTypesQuery = () => {
  return useQuery({
    queryKey: ["clientTypes"],
    queryFn: getClientTypesAPI,
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
    select: (data) => {
      // Transform the API response if needed
      // For example, formatting the data for a select input
      return data?.data?.map((type) => ({
        value: type.id,
        label: type.title,
      }));
    },
  });
};
