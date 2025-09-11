import { useQuery } from "@tanstack/react-query";
import { getUsersListAPI } from "../../services/admin/getUsersList";

export const useGetUsersListQuery = () => {
  return useQuery({
    queryKey: ["usersList"],
    queryFn: getUsersListAPI,
    onSuccess: (data) => {
      // You can handle success actions here if needed
      // For example, formatting the data or setting some state
      return data;
    },
    onError: (error) => {
      console.log(
        error.response?.data?.message ||
          "Failed to fetch client types. Please try again."
      );
    },
  });
};
