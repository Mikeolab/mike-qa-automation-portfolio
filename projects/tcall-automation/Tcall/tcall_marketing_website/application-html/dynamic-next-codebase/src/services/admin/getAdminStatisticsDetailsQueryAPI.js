import { axiosInstance } from "../../lib/axios";

export const getAdminStatisticsDetailsQueryAPI = async () => {
  try {
    console.log('get api')
    const response = await axiosInstance.get("/admin_statistics_detail/");
    console.log("API Response:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("API Call Error:", error); // Debugging
    throw error; // Ensure errors are thrown to propagate to onError in useQuery
  }
};
