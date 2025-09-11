import { axiosInstance } from "../../lib/axios";

export const addBusinessDetailsAPI = async (data) => {
  const response = await axiosInstance.post("/business_detail/", data);
  return response.data;
};
