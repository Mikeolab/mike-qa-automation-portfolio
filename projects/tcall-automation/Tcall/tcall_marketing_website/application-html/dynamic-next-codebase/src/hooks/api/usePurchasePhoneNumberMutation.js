import { useMutation } from "@tanstack/react-query";
import { purchasePhoneNumberAPI } from "../../services/admin/purchasePhoneNumberAPI";

export const usePurchasePhoneNumberMutaion = (options = {}) => {
    // console.log({options})
  const mutation = useMutation({
    mutationKey: ["purchaseNewNumber"],
    mutationFn: purchasePhoneNumberAPI,
    ...options,
  });

  return mutation;
};
