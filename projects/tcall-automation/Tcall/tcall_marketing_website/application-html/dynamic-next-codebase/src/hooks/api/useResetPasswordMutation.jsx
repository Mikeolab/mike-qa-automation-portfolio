import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useResetPasswordMutation = (options = {}) => {
  const mutation = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async (data) =>
      await axios.post(
        `${process.env.REACT_APP_API_URL}/forgot_password/`,
        data.payload,
        {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        }
      ),
    ...options,
  });

  return mutation;
};
