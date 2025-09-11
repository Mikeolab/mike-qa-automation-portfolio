import { axiosInstance } from "../../lib/axios";

export const getBusinessDetailsAPI = async () => {
  const response = await axiosInstance.get("/business_detail/");
  return response.data;
};
