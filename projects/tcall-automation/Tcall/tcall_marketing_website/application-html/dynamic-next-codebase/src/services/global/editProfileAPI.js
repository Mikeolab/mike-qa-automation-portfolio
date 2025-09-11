import { axiosInstanceFormData } from "../../lib/axios";

export const editProfileAPI = async (data) => {
    const response = await axiosInstanceFormData.patch("/client_details/", data);
    return response.data;
  };