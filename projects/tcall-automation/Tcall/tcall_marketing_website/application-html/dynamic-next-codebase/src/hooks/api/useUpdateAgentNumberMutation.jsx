import { useMutation } from "@tanstack/react-query";
import { updateAgentNumberAPI } from "../../services/admin/updateAgentNumberAPI";

export const useUpdateAgentNumberMutation = (options = {}) => {
  const mutation = useMutation({
    mutationKey: ["updateAgentNumberMutation"],
    mutationFn: updateAgentNumberAPI,
    ...options,
  });

  return mutation;
};
