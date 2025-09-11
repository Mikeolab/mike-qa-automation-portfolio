import { axiosInstance } from "../../lib/axios";

export const updateAgentDetailsAPI = async (data) => {
  const response = await axiosInstance.patch(
    `/agent_detail/${data.id}/`,
    data.payload
  );
  return response.data;
};
