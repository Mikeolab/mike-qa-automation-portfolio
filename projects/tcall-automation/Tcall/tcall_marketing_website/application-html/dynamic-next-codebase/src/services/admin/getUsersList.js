import { axiosInstance } from "../../lib/axios";

export const getUsersListAPI = async () => {
  const response = await axiosInstance.get("/admin_client_business_list/");
  return response.data;
};
