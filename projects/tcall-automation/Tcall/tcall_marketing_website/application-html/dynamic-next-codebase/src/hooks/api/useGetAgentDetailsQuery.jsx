import { useQuery } from "@tanstack/react-query";
import { getAgentDetailsAPI } from "../../services/admin/getAgentDetails";

export const useGetAgentDetailsQuery = (agentId, options = {}) => {
  return useQuery({
    queryKey: ["agentDetails", agentId],
    queryFn: () => getAgentDetailsAPI(agentId),
    ...options,
  });
};
