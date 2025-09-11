import { useState } from "react";

import { Link } from "react-router-dom";
import agentIcon from "../../../assets/images/icons/agent-name1.png";
import BackButton from "../../../components/shared/BackButton";
import IncomingCallIcon from "../../../components/icons/IncomingCallIcon";
import { useGetClientAgentsQuery } from "../../../hooks/api/useGetClientAgentsQuery";
import SearchAgents from "../../../components/admin/SearchAgents";
import FilterAgentsByClient from "../../../components/admin/FilterAgentsByClient";
import AgentRow from "../../../components/admin/AgentRow";
import Pagination from "../../../components/shared/Pagination";
import { DEFAULT_PAGE_SIZE } from "../../../lib/constants";

const AgentInboundList = () => {
  const [searchParams, setSearchParams] = useState({
    client: null,
    search: "",
    is_inbound: true,
    page: 1,
  });
  const {
    data: response,
    isPending,
    isError,
    refetch,
  } = useGetClientAgentsQuery(searchParams);

  const handleSearchChange = (search) => {
    setSearchParams((prev) => ({ ...prev, search }));
  };
  const handleClientChange = (client) => {
    console.log(client);
    setSearchParams((prev) => ({ ...prev, client: client }));
  };
  const handlePageChange = (newPage) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
  };

  console.log(response);

  return (
    <div className="o-dasboard__rightbar">
      <div className="o-dasboard__rightheading">
        <BackButton />
      </div>
      <div className="o-dasboard__rightbody o-agentlist">
        <div className="o-agentlist__heading">
          <div className="o-agentlist__leftheading">
            <IncomingCallIcon />
            <h4>My Inbound Agents list</h4>
          </div>
          <div className="o-agentlist__headsearch">
            <SearchAgents
              value={searchParams.search}
              onChange={handleSearchChange}
            />
            <FilterAgentsByClient
              value={searchParams.client}
              onChange={handleClientChange}
            />
          </div>
        </div>
        <ul className="o-agentlist__list">
          {isPending ? (
            // Show 3 loading skeleton rows
            Array.from({ length: 3 }).map((_, index) => (
              <AgentRow
                key={`loading-${index}`}
                isLoading={true}
                isInbound={true}
              />
            ))
          ) : isError ? (
            <AgentRow agent={null} isInbound={true} />
          ) : response?.data?.length ? (
            response?.data?.map((agent) => (
              <AgentRow
                key={agent.id}
                agent={agent}
                isInbound={true}
                refetchAgents={refetch}
              />
            ))
          ) : (
            <AgentRow agent={null} isInbound={true} />
          )}
        </ul>
        {/* Add pagination below the list */}
        {!isPending && !isError && response?.data?.length > 0 && (
          <Pagination
            currentPage={searchParams.page}
            totalPages={Math.ceil(response?.count / DEFAULT_PAGE_SIZE)}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default AgentInboundList;
