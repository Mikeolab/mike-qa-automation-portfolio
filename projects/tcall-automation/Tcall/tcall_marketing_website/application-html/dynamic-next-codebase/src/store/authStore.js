import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { loginAPI, logoutAPI } from "../services/auth/authAPI";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      setUser: (userData) => set({ user: userData }),
      login: async (credentials, navigate) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginAPI(credentials);
          Cookies.set("accessToken", response.data.access_token, {
            expires: 1, // expires in 1 day
            secure: true,
            sameSite: "strict",
          });
          set({ user: response.data.user_data, isLoading: false });
          console.log("response", response.data.user_data);
          if (response.data.user_data.role === "Admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/customer/dashboard");
          }
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "An error occurred during login";
          set({ error: errorMessage, isLoading: false });
        }
      },
      logout: async (navigate) => {
        await logoutAPI();
        set({ user: null, error: null });
        Cookies.remove("accessToken");
        navigate("/login");
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }), // only persist user data
    }
  )
);

export default useAuthStore;
