import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getClientListDropdownAPI } from "../../services/admin/getClientListDropdown";

export const useGetClientListDropdownQuery = (options = {}, page) => {
  console.log({ object: options, page });
  const { enabled = true, per_page } = options;
  return useQuery({
    queryKey: ["clientListDropdown", page, per_page],
    queryFn: () => getClientListDropdownAPI(page, per_page),
    enabled: enabled,
    onSuccess: (data) => {
      // You can handle success actions here if needed
      // For example, formatting the data or setting some state
      return data;
    },
    onError: (error) => {
      console.log(
        error.response?.data?.message ||
          "Failed to fetch client list dropdown. Please try again."
      );
    },
    select: (data) => {
      return data?.data?.map((client) => ({
        value: client.client,
        label: client.client_name,
      }));
    },
  });
};

export const useGetClientListDropdownQuery2 = (options = {}) => {
  const { enabled = true } = options;

  return useInfiniteQuery({
    queryKey: ["clientListDropdown2"],
    queryFn: async ({ pageParam = 1 }) =>
      getClientListDropdownAPI({ page: pageParam, per_page: 10 }),
    enabled: enabled,
    getNextPageParam: (lastPage) => {
      // Determine the next page if `hasNextPage` is true
      const nextPage = lastPage?.hasNextPage
        ? lastPage.next?.split("page=")[1]?.split("&")[0]
        : undefined;
      return nextPage ? Number(nextPage) : undefined;
    },
    onError: (error) => {
      console.error(
        error.response?.data?.message ||
          "Failed to fetch client list dropdown. Please try again."
      );
    },
    select: (data) => ({
      pages: data.pages.map((page) => ({
        data: page.data.map((client) => ({
          value: client.client,
          label: client.client_name,
        })),
      })),
      hasNextPage: data.hasNextPage,
    }),
  });
};
