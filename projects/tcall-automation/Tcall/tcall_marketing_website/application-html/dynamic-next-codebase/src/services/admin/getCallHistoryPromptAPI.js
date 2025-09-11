import { axiosInstance } from "../../lib/axios";

export const getCallHistoryPromptAPI = async (searchParams) => {
  const queryParams = new URLSearchParams();
  if (searchParams.client_id) queryParams.append("client_id", searchParams.client_id);
  const response = await axiosInstance.get(
    `/get_prompt_for_call_details/?${queryParams.toString()}`
  );
  return response.data;
};