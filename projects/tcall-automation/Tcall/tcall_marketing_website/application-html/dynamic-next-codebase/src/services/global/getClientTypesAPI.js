import { axiosInstance } from "../../lib/axios";

export const getClientTypesAPI = async () => {
  const response = await axiosInstance.get("/get_client_type/");
  return response.data;
};
