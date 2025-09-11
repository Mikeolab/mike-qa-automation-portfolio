import { useMutation } from "@tanstack/react-query";
import { editProfileAPI } from "../../services/global/editProfileAPI";

export const useEditProfileMutation = (options = {}) => {
    // console.log({options})
  const mutation = useMutation({
    mutationKey: ["editProfile"],
    mutationFn: editProfileAPI,
    ...options,
  });

  return mutation;
};
