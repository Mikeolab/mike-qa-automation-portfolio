import { axiosInstance } from "../../lib/axios";

export const getPurchasedPhoneNumberAPI = async (searchParams) => {
  const queryParams = new URLSearchParams();
  if (searchParams.search) queryParams.append("search", searchParams.search);
  if (searchParams.page) queryParams.append("page", searchParams.page);
  if (searchParams.is_active)
    queryParams.append("is_active", searchParams.is_active);

  const response = await axiosInstance.get(
    `/purchase_number/?${queryParams.toString()}`
  );
  return response.data;
};
