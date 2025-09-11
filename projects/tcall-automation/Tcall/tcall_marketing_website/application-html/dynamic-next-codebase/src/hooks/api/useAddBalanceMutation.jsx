import { useMutation } from "@tanstack/react-query";
import { getAddBalanceMutationAPI } from "../../services/customer/getAddBalanceMutationAPI";

export const useAddBalanceMutation = (options = {}) => {
  const mutation = useMutation({
    mutationKey: ["getAddBalanceMutation"],
    mutationFn: getAddBalanceMutationAPI,
    ...options,
  });

  return mutation;
};
