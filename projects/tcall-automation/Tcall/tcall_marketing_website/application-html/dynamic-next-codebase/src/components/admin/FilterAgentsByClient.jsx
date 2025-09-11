import Select from "react-select";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getClientListDropdownAPI } from "../../services/admin/getClientListDropdown";

export default function FilterAgentsByClient({
  value,
  onChange,
  phone,
  parentClassName = "form-groups",
  showLabel = true,
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["clients-dropdown"],
      queryFn: ({ pageParam = 1 }) => getClientListDropdownAPI(pageParam),
      getNextPageParam: (lastPage, pages) => {
        console.log(lastPage, pages);
        return lastPage.hasNextPage ? pages.length + 1 : undefined;
      },
      initialPageParam: 1,
    });
  console.log(data);
  const options =
    data?.pages.flatMap((page) =>
      page.data.map((client) => ({
        label: client.client_name,
        value: client.client,
      }))
    ) || [];

  console.log(options);

  return (
    <div className="flex flex-col gap-2">
      {showLabel && <label className="text-black font-medium">Filter By</label>}
      <Select
        classNamePrefix="react-select"
        className="text-black"
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "white",
            color: "black", // Ensure text is black
          }),
          singleValue: (base) => ({
            ...base,
            color: "black", // Ensure selected value text is black
          }),
          option: (base, state) => ({
            ...base,
            color: state.isSelected ? "white" : "black", // Ensure options text is black unless selected
            backgroundColor: state.isSelected ? "black" : "white", // Change background color when selected
          }),
        }}
        value={value}
        onChange={(selected) => onChange(selected, phone)}
        options={options}
        isClearable
        placeholder="Select Client"
        menuPlacement="auto"
        onMenuScrollToBottom={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
      />
    </div>
  );
}
