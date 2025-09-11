import { useMutation } from "@tanstack/react-query";
import { updatePurchaseNumberAssignStatusAPI } from "../../services/admin/updatePurchaseNumberAssignStatus";

export const useUpdatePurchaseMutation = (options = {}) => {
  const mutation = useMutation({
    mutationKey: ["update-purchase"],
    mutationFn: updatePurchaseNumberAssignStatusAPI,
    ...options,
  });

  return mutation;
};
