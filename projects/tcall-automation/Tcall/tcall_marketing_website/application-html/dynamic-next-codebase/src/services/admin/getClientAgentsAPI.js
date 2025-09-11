import { axiosInstance } from "../../lib/axios";

export const getClientAgentsAPI = async (searchParams) => {
  const queryParams = new URLSearchParams();
  if (searchParams.search) queryParams.append("search", searchParams.search);
  queryParams.append("is_inbound", searchParams.is_inbound);
  if (searchParams.client)
    queryParams.append("client", searchParams.client.value);
  if (searchParams.page) queryParams.append("page", searchParams.page);
  const response = await axiosInstance.get(
    `/client_agent_list/?${queryParams.toString()}`
  );
  return response.data;
};
