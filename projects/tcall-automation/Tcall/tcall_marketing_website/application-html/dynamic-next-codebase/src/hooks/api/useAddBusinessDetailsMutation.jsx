import { useMutation } from "@tanstack/react-query";
import { addBusinessDetailsAPI } from "../../services/customer/addBusinessDetails";

export const useAddBusinessDetailsMutation = (options = {}) => {
  const mutation = useMutation({
    mutationKey: ["addBusinessDetails"],
    mutationFn: addBusinessDetailsAPI,
    ...options,
  });

  return mutation;
};
