import { axiosInstance } from "../../lib/axios";

export const updatePurchaseNumberAssignStatusAPI = async (data) => {
  const response = await axiosInstance.patch(
    `/purchase_number/${data.id}/`,
    data.payload
  );
  return response.data;
};
