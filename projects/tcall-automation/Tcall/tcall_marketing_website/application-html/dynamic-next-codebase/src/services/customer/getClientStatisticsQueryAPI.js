import { axiosInstance } from "../../lib/axios";

export const getClientStatisticsQueryAPI = async () => {
  const response = await axiosInstance.get("/client_statistic_details/");
  return response.data;
};
