import { axiosInstance } from "../../lib/axios";

export const getCallHistoryAPI = async (searchParams) => {
  const queryParams = new URLSearchParams();
  if (searchParams.search) queryParams.append("search", searchParams.search);
  if (searchParams.page) queryParams.append("page", searchParams.page);
  if (searchParams.number) queryParams.append("number", searchParams.number);
  if (searchParams.filter_by) queryParams.append("filter_by", searchParams.filter_by);
  if (searchParams.start_date) queryParams.append("start_date", searchParams.start_date);
  const response = await axiosInstance.get(
    `/call_history_list/?${queryParams.toString()}`
  );
  return response.data;
};