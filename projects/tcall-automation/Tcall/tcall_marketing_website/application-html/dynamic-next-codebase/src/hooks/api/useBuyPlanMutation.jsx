import { useMutation } from "@tanstack/react-query";
import { getBuyPlanMutationAPI } from "../../services/customer/getBuyPlanMutationAPI";

export const useBuyPlanMutation = (options = {}) => {
  const mutation = useMutation({
    mutationKey: ["getBuyPlanMutation"],
    mutationFn: getBuyPlanMutationAPI,
    ...options,
  });

  return mutation;
};
