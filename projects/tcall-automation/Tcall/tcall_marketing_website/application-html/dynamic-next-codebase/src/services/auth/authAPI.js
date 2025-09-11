import { axiosInstance } from "../../lib/axios";

export const registerAPI = async (credentials) => {
  const response = await axiosInstance.post("/register/", credentials);
  return response.data;
};

export const loginAPI = async (credentials) => {
  const response = await axiosInstance.post("/login/", credentials);
  return response.data;
};

export const logoutAPI = async () => {
  await axiosInstance.post("/logout/", {});
};

export const sendOTPAPI = async (payload) => {
  const response = await axiosInstance.post("/send_otp/", payload);
  return response.data;
};

export const verifyOTPAPI = async (payload) => {
  const response = await axiosInstance.post("/verify_otp/", payload);
  return response.data;
};
