import React, { useState } from "react";

import { Link } from "react-router-dom";
import IncomingCallIcon from "../icons/IncomingCallIcon";
import { useGetClientAgentsQuery } from "../../hooks/api/useGetClientAgentsQuery";
import agentName1 from "../../assets/images/icons/agent-name1.png";

export default function InbountAgentCard() {
  const [searchParams, setSearchParams] = useState({
    search: "",
    is_inbound: true,
    client: "",
  });
  const {
    data: agents,
    isLoading,
    isError,
  } = useGetClientAgentsQuery(searchParams);
  console.log(agents);
  return (
    <div className="agent-calls__bound">
      <div className="agent-calls__boundheading">
        <IncomingCallIcon />
        <h4>My Inbound Agents</h4>
      </div>
      <div className="agent-calls__bnames">
        <ul className="agent-calls__agentname">
          {agents?.data?.slice(0, 3)?.map((agent, index) => (
            <li key={agent?.id}>
              <img src={agentName1} alt={agent?.name} />
            </li>
          ))}
        </ul>
        {agents?.data?.length > 3 && (
          <span className="agent-calls__agentcount">+{agents.count - 3}</span>
        )}
      </div>
      <p className="agent-calls__agenttext">
        {agents?.count > 0
          ? agents?.data
              ?.slice(0, 3)
              ?.map((agent) => agent?.name)
              ?.join(", ") + (agents?.count > 3 ? " & others" : "")
          : "No agents available"}
      </p>
      <div className="agent-calls__btnarea">
        <Link to="/admin/agent-inbound-list" className="agent-calls__agentbtn">
          view all
        </Link>
      </div>
    </div>
  );
}
