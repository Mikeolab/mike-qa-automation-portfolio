import { axiosInstance } from "../../lib/axios";

export const addCallTransferDetailsAPI = async (payload) => {
  const response = await axiosInstance.post(`/agent_call_transfer/`, payload);
  return response.data;
};
