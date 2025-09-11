import { useMutation } from "@tanstack/react-query";
import { verifyOTPAPI } from "../../services/auth/authAPI";

export const useVerifyOTPMutation = (options = {}) => {
  const mutation = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: verifyOTPAPI,
    ...options,
  });

  return mutation;
};
