import React from "react";

import { Link } from "react-router-dom";
import profileImage from "../../assets/images/icons/agent-name1.png";

const AgentCard = ({ agent }) => {
  return (
    <li className="o-dasboard__agentli">
      <span className="img">
        <img src={profileImage} alt="profile" />
      </span>
      <span className="name">{agent.name}</span>
      <Link
        to={`/customer/agents/add-agent-language?agentId=${
          agent?.id
        }&is_inbound=${true}`}
        className="button"
      >
        View agent
      </Link>
    </li>
  );
};

export default AgentCard;
