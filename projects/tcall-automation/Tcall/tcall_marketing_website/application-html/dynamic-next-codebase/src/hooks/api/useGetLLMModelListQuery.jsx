import { useQuery } from "@tanstack/react-query";
import { getLLMModelListAPI } from "../../services/global/getLLMModelListAPI";

export const useGetLLMModelListQuery = () => {
  return useQuery({
    queryKey: ["llmModelList"],
    queryFn: getLLMModelListAPI,
    onSuccess: (data) => {
      // You can handle success actions here if needed
      // For example, formatting the data or setting some state
      return data;
    },
    onError: (error) => {
      console.log(
        error.response?.data?.message ||
          "Failed to fetch LLM model list. Please try again."
      );
    },
    select: (data) => {
      const returnData = data?.data?.find((el) => el.value === "gpt-4o");
      return returnData.id;
    },
  });
};
