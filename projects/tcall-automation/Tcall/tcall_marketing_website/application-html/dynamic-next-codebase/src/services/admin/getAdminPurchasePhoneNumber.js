import { axiosInstance } from "../../lib/axios";

export const getAdminPurchasePhoneNumberAPI = async (searchParams) => {
  const queryParams = new URLSearchParams();
  if (searchParams.contains) queryParams.append("contains", searchParams.contains);
  if (searchParams.area_code) queryParams.append("area_code", searchParams.area_code);
  if (searchParams.page) queryParams.append("page", searchParams.page);
  if (searchParams.iso_country_code)
    queryParams.append("iso_country_code", searchParams.iso_country_code);

  const response = await axiosInstance.get(
    `/available_numbers_list/?${queryParams.toString()}`
  );
  return response.data;
};
