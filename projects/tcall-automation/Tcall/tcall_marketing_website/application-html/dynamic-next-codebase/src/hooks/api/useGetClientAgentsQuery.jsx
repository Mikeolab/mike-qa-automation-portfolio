import { useQuery } from "@tanstack/react-query";
import { getClientAgentsAPI } from "../../services/admin/getClientAgentsAPI";

export const useGetClientAgentsQuery = (searchParams) => {
  return useQuery({
    queryKey: ["clientAgents", searchParams],
    queryFn: () => getClientAgentsAPI(searchParams),
    onSuccess: (data) => {
      // You can handle success actions here if needed
      // For example, formatting the data or setting some state
      return data;
    },
    onError: (error) => {
      console.log(
        error.response?.data?.message ||
          "Failed to fetch client agents. Please try again."
      );
    },
  });
};
