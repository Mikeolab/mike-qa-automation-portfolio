import { axiosInstance } from "../../lib/axios";

export const updateAgentNumberAPI = async (data) => {
  const { id, purchase_number, agent} = data;
  const response = await axiosInstance.patch(`/agent_assign_to_purchased_number/${id}/`, {purchase_number, agent});
  return response.data;
};
