import { useMutation } from "@tanstack/react-query";
import { changePasswordAPI } from "../../services/admin/changePassword";

export const useChangePasswordMutation = (options = {}) => {
    // console.log({options})
  const mutation = useMutation({
    mutationKey: ["changePassword"],
    mutationFn: changePasswordAPI,
    ...options,
  });

  return mutation;
};
