import { useQuery } from "@tanstack/react-query";
import { getCallListDetailsAPI } from "../../services/admin/getCallListDetailsQuery";

export const useGetCallListDetailsQuery = (searchParams, options = {}) => {
  return useQuery({
    queryKey: ["callListDetails", searchParams],
    queryFn: () => getCallListDetailsAPI(searchParams),
    ...options,
  });
};
