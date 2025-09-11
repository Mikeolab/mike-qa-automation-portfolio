import { axiosInstance } from "../../lib/axios";

export const getAgentDetailsAPI = async (id) => {
  const response = await axiosInstance.get(`/agent_detail/${id}/`);
  return response.data;
};
