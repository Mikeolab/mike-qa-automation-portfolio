import { useMutation } from "@tanstack/react-query";
import { registerAPI } from "../../services/auth/authAPI";

export const useRegisterMutation = (options = {}) => {
  const mutation = useMutation({
    mutationKey: ["register"],
    mutationFn: registerAPI,
    ...options,
  });

  return mutation;
};
