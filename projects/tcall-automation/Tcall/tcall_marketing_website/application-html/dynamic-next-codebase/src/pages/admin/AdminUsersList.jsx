import React, { useState } from "react";

import ClientBusinessList from "../../components/customer/ClientBusinessList";
import SortBySelect from "../../components/shared/SortBySelect";
import SearchInput from "../../components/shared/SearchInput";
import BackButton from "../../components/shared/BackButton";
import { useGetClientBusinessListQuery } from "../../hooks/api/useGetClientBusinessListQuery";

export default function AdminUsersList() {
  const [searchParams, setSearchParams] = useState({
    client: "",
    search: "",
    status: "",
  });
  const {
    data: response,
    isPending,
    isError,
  } = useGetClientBusinessListQuery(searchParams);
  const handleSearchChange = (search) => {
    setSearchParams((prev) => ({ ...prev, search }));
  };
  const handleStatusChange = (status) => {
    setSearchParams((prev) => ({ ...prev, status }));
  };

  return (
    <div className="o-dasboard__rightbar">
      <div className="o-dasboard__rightheading">
        <BackButton />
      </div>
      <div className="o-dasboard__rightbody o-agentlist">
        <div className="o-agentlist__heading">
          <div className="o-agentlist__leftheading">
            <h2 className="o-dasboard__title">Tcall Users</h2>
          </div>
          <div className="o-agentlist__headsearch">
            <SearchInput
              value={searchParams.search}
              onChange={handleSearchChange}
            />
            <SortBySelect
              value={searchParams.status}
              onChange={handleStatusChange}
            />
          </div>
        </div>

        <ClientBusinessList
          businessList={response?.data}
          isLoading={isPending}
          isError={isError}
        />
      </div>
    </div>
  );
}
