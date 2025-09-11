import React from "react";

import { Link } from "react-router-dom";
import profileImage from "../../../assets/images/profile-image.png"; // Update the path according to your project structure
import IncomingCallIcon from "../../../components/icons/IncomingCallIcon";
import { useGetClientAgentsQuery } from "../../../hooks/api/useGetClientAgentsQuery";
import AgentCard from "../../../components/customer/AgentCard";

const AgentsDashboard = () => {
  const { data, isPending } = useGetClientAgentsQuery({
    is_inbound: true,
  });
  console.log(data);
  const renderContent = () => {
    if (isPending) {
      return (
        <ul className="o-dasboard__agentul gap-2">
          {[1, 2].map((index) => (
            <li key={index} className="o-dasboard__agentli animate-pulse">
              <span className="img bg-gray-200 rounded-full w-12 h-12"></span>
              <span className="name bg-gray-200 h-4 w-24 rounded"></span>
              <span className="button bg-gray-200 h-8 w-20 rounded"></span>
            </li>
          ))}
        </ul>
      );
    }

    if (!data?.data?.length) {
      return (
        <div className="text-center py-8">
          <p>No agents found. Please add some agents to get started.</p>
        </div>
      );
    }

    return (
      <ul className="o-dasboard__agentul gap-2">
        {data.data.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </ul>
    );
  };

  return (
    <div className="o-dasboard__rightbar">
      <div className="o-dasboard__rightheading">
        <h2 className="o-dasboard__title">Agents</h2>
      </div>
      <div className="o-dasboard__rightbody">
        <h3 className="o-dasboard__tabtittle">
          <IncomingCallIcon />
          My Inbound Agent
        </h3>
        {renderContent()}
      </div>
    </div>
  );
};

export default AgentsDashboard;
