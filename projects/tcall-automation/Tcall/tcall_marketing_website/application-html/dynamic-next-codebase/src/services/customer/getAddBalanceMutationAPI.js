import { axiosInstance } from "../../lib/axios";

export const getAddBalanceMutationAPI = async (data) => {
  const response = await axiosInstance.post("/create_an_intent/", data);
  return response.data;
};
