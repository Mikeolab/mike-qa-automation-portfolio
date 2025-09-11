import { axiosInstance } from "../../lib/axios";

export const getPreMadePromptsAPI = async (searchParams) => {
  const queryParams = new URLSearchParams();

  if (searchParams.is_inbound) {
    queryParams.append("is_inbound", searchParams.is_inbound);
  }
  const response = await axiosInstance.get(`/agent_pre_made_prompts_list/?${queryParams.toString()}`);
  return response.data;
};
