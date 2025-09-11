import { axiosInstance } from "../../lib/axios";

export const agentAssignToPurchaseNumberAPI = async (payload) => {
  const response = await axiosInstance.post(
    `/agent_assign_to_purchased_number/`,
    payload
  );
  return response.data;
};
