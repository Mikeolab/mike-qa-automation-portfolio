import { axiosInstance } from "../../lib/axios";

export const getClientBusinessListAPI = async (searchParams) => {
  const queryParams = new URLSearchParams();
  if (searchParams.client) queryParams.append("client", searchParams.client);
  if (searchParams.search) queryParams.append("search", searchParams.search);
  if (searchParams.status) queryParams.append("status", searchParams.status);

  const response = await axiosInstance.get(
    `/admin_client_business_list/?${queryParams.toString()}`
  );
  return response.data;
};
