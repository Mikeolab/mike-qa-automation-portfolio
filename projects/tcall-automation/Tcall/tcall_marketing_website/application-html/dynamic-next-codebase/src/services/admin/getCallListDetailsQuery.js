import { axiosInstance } from "../../lib/axios";

export const getCallListDetailsAPI = async (searchParams) => {
  const queryParams = new URLSearchParams();
  if (searchParams.search) queryParams.append("search", searchParams.search);
  if (searchParams.page) queryParams.append("page", searchParams.page);
  if (searchParams.client) queryParams.append("client", searchParams.client?.value);
  const response = await axiosInstance.get(
    `/get_unique_number_list/?${queryParams.toString()}`
  );
  return response.data;
};
