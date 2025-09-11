import { useMutation } from "@tanstack/react-query";
import { createAgentAPI } from "../../services/admin/createAgentAPI";

export const useCreateAgentMutation = (options = {}) => {
  const mutation = useMutation({
    mutationKey: ["createAgent"],
    mutationFn: createAgentAPI,
    ...options,
  });

  return mutation;
};
