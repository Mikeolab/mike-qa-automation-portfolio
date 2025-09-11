import { axiosInstance } from "../../lib/axios";

export const getAgentsListAPI = async (searchParams) => {
  const queryParams = new URLSearchParams();
  if (searchParams.page) queryParams.append("page", searchParams.page);
  if (searchParams.per_page)
    queryParams.append("per_page", searchParams.per_page);

  const response = await axiosInstance.get(
    `/get_agent_list/?${queryParams.toString()}`
  );
  return response.data;
};
