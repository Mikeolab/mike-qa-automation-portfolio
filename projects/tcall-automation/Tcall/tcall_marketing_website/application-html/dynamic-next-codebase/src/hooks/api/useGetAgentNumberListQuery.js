import { useQuery } from "@tanstack/react-query";
import { getAgentNumberListAPI } from "../../services/admin/getAgentNumberListAPI";

export const useGetAgentNumberListQuery = (searchParams, options = {}) => {
  console.log({options})
  return useQuery({
    queryKey: ["agentNumberListByClientID", searchParams],
    ...options,
    queryFn: () => getAgentNumberListAPI(searchParams),
    onSuccess: (data) => {
      // You can handle success actions here if needed
      // For example, formatting the data or setting some state
      return data;
    },
    onError: (error) => {
      console.log(
        error.response?.data?.message ||
          "Failed to fetch Client Details. Please try again."
      );
    }
  });
};
