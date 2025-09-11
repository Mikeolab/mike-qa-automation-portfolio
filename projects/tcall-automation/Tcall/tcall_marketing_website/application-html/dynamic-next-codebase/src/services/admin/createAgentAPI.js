import { axiosInstance } from "../../lib/axios";

export const createAgentAPI = async (payload) => {
  const response = await axiosInstance.post(`/agent_detail/`, payload);
  return response.data;
};
