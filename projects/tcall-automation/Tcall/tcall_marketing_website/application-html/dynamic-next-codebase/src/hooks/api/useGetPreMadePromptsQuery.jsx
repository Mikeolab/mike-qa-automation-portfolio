import { useQuery } from "@tanstack/react-query";
import { getPreMadePromptsAPI } from "../../services/admin/getPreMadePromts";

export const useGetPreMadePromptsQuery = (searchParams) => {
  return useQuery({
    queryKey: ["preMadePrompts", searchParams],
    queryFn: () => getPreMadePromptsAPI(searchParams),
    onSuccess: (data) => {
      // You can handle success actions here if needed
      // For example, formatting the data or setting some state
      return data;
    },
    onError: (error) => {
      console.log(
        error.response?.data?.message ||
          "Failed to fetch pre made prompts. Please try again."
      );
    },
    select: (data) => {
      let modifiedData = [];
      if (data?.data?.length > 0) {
        modifiedData = data.data;
      } else {
        modifiedData = [
          {
            id: 10,
            title: "Restaurant Management",
          },
          {
            id: 9,
            title: "Cold_call_1",
          },
          {
            id: 8,
            title: "Dentist_Receptionist",
          },
          {
            id: 7,
            title: "Real_Estate_Seller_2",
          },
          {
            id: 6,
            title: "Hotel_Booking_2",
          },
          {
            id: 5,
            title: "Hotel_Booking",
          },
          {
            id: 4,
            title: "Churn_Prevention_Supply_Chain",
          },
          {
            id: 3,
            title: "Real_Estate_Seller_1",
          },
          {
            id: 2,
            title: "Family_Insurance_Sales",
          },
          {
            id: 1,
            title: "B2BSAAS_Inbound",
          },
        ];
      }
      return modifiedData?.map((prompt) => ({
        value: prompt.id,
        label: prompt.title,
      }));
    },
  });
};
