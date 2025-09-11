import { axiosInstance } from "../../lib/axios";

export const getLLMModelListAPI = async () => {
  const response = await axiosInstance.get("/retell_llm_model_list/");
  return response.data;
};
