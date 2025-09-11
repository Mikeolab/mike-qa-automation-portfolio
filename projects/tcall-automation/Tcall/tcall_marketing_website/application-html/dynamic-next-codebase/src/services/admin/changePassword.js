import { axiosInstance } from "../../lib/axios";

export const changePasswordAPI = async (data) => {
    console.log({passwrodData : data});
    // return
    const response = await axiosInstance.post("/change_password/", data);
    return response.data;
  };