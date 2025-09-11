import { useQuery } from "@tanstack/react-query";
import { getBusinessTypesAPI } from "../../services/global/getBusinessTypesAPI";

export const useGetBusinessTypesQuery = () => {
  return useQuery({
    queryKey: ["businessTypes"],
    queryFn: getBusinessTypesAPI,
    onSuccess: (data) => {
      // You can handle success actions here if needed
      // For example, formatting the data or setting some state
      return data;
    },
    onError: (error) => {
      console.log(
        error.response?.data?.message ||
          "Failed to fetch business types. Please try again."
      );
    },
    select: (data) => {
      return data?.data?.map((type) => ({
        value: type.title, // not id
        label: type.title,
      }));
    },
  });
};
