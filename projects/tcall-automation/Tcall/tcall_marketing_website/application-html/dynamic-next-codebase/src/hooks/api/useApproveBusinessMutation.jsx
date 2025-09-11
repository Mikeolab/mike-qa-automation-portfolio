import { useMutation } from "@tanstack/react-query";
import { approveBusinessAPI } from "../../services/admin/approveBusinessAPI";

export const useApproveBusinessMutation = (options = {}) => {
  const mutation = useMutation({
    mutationKey: ["approveBusiness"],
    mutationFn: approveBusinessAPI,
    ...options,
  });

  return mutation;
};
