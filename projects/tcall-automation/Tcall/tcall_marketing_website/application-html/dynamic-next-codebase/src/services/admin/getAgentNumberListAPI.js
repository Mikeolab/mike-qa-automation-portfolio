import { axiosInstance } from "../../lib/axios";

export const getAgentNumberListAPI = async (searchParams) => {
  console.log({searchParams})
  const queryParams = new URLSearchParams();
  if (searchParams.client) {
    queryParams.append('client', searchParams.client);
  }
  if (searchParams.is_already_assigned) {
    queryParams.append('is_already_assigned', searchParams.is_already_assigned);
  }
  const response = await axiosInstance.get(`/purchase_number/?${queryParams?.toString()}`);
  return response.data;
};
