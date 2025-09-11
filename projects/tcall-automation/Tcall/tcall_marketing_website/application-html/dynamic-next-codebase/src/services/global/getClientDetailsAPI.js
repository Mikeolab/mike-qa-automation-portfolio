import { axiosInstance } from "../../lib/axios";

export const getClientDetailsAPI = async () => {
  const response = await axiosInstance.get("/client_details/");
  return response.data;
};
