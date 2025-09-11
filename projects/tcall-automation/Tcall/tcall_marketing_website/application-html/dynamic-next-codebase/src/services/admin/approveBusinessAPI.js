import { axiosInstance } from "../../lib/axios";

export const approveBusinessAPI = async (payload) => {
  const response = await axiosInstance.patch(
    `/admin_client_business_detail/${payload.id}/`,
    payload.body
  );
  return response.data;
};
