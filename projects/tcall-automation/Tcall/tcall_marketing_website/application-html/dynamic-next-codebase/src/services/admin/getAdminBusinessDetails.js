import { axiosInstance } from "../../lib/axios";

export const getAdminBusinessDetailsAPI = async (businessId) => {
  const response = await axiosInstance.get(
    `/admin_client_business_detail/${businessId}/`
  );
  return response.data;
};
