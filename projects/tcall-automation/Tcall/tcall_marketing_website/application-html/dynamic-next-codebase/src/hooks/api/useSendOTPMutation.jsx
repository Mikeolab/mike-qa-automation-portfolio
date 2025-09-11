import { useMutation } from "@tanstack/react-query";
import { sendOTPAPI } from "../../services/auth/authAPI";

export const useSendOTPMutation = (options = {}) => {
  const mutation = useMutation({
    mutationKey: ["send-otp"],
    mutationFn: sendOTPAPI,
    ...options,
  });

  return mutation;
};
