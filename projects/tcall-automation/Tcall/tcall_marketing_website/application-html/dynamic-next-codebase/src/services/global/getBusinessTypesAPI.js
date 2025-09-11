import { axiosInstance } from "../../lib/axios";

export const getBusinessTypesAPI = async () => {
  const response = await axiosInstance.get("/business_type/");
  return response.data;
};
