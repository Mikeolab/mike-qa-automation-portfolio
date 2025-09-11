import { useMutation } from "@tanstack/react-query";
import { updateAgentDetailsAPI } from "../../services/admin/updateAgentDetails";

export const useUpdateAgentDetailsMutation = (options = {}) => {
  const mutation = useMutation({
    mutationKey: ["update-agent-details"],
    mutationFn: updateAgentDetailsAPI,
    ...options,
  });

  return mutation;
};
