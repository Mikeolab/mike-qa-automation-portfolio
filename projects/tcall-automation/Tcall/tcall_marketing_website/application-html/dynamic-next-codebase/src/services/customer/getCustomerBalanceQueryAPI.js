import { axiosInstance } from "../../lib/axios";

export const getCustomerBalanceQueryAPI = async () => {
  const response = await axiosInstance.get("/client_balance/");
  return response.data;
};
