import { axiosInstance } from "../../lib/axios";

export const getAgentPremadePromptAPI = async (id) => {
  const response = await axiosInstance.get(
    `/agent_pre_made_prompts_details/${id}/`
  );
  return response.data;
};
