import { axiosInstance } from "../../lib/axios";

export const purchasePhoneNumberAPI = async (data) => {
    console.log({purchase : data});
    // return 
    const response = await axiosInstance.post("/purchase_number/", data);
    return response.data;
  };