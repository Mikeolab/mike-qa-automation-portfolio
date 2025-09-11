import { useQuery } from "@tanstack/react-query";
import { getAgentPremadePromptAPI } from "../../services/admin/getAgentPremadePrompt";

export const useGetAgentPremadePromptQuery = (promptId, options = {}) => {
  return useQuery({
    queryKey: ["premadePrompt", promptId],
    queryFn: () => getAgentPremadePromptAPI(promptId),
    ...options,
  });
};
