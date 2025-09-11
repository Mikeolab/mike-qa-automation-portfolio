import { axiosInstance } from "../../lib/axios";

export const getPlanDetailsAPI = async () => {
  const response = await axiosInstance.get("/pricing_plan_list/");
  return response.data;
};
