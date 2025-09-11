import { axiosInstance } from "../../lib/axios";

export const getClientListDropdownAPI = async (page = 1, per_page=10) => {
  const response = await axiosInstance.get(
    `/admin_client_business_list/?is_for_dropdown=true&page=${page}&per_page=${per_page}`
  );
  return response.data;
};

export const getClientListFilterDropdownAPI = async (searchParams) => {

  const queryParams = new URLSearchParams();
  if (searchParams.page) queryParams.append("page", searchParams.page);
  if (searchParams.is_for_dropdown)
    queryParams.append("is_for_dropdown", searchParams.is_for_dropdown);
  if (searchParams.per_page)
    queryParams.append("per_page", searchParams.per_page);

  const response = await axiosInstance.get(
    `/admin_client_business_list/?${queryParams.toString()}`
  );

  return response.data;
};
