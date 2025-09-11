import { Link } from "react-router-dom";
import addAgentImage from "../../assets/images/add-img.png";
import agentName1 from "../../assets/images/icons/agent-name1.png";
import agentName2 from "../../assets/images/icons/agent-name2.png";
import agentName3 from "../../assets/images/icons/agent-name3.png";
import RightArrowIcon from "../../components/icons/RightArrowIcon";
import InbountAgentCard from "../../components/admin/InbountAgentCard";
import OutboundAgentCard from "../../components/admin/OutboundAgentCard";

const AgentsDashboard = () => {
  return (
    <div className="o-dasboard__rightbar">
      <div className="o-dasboard__rightheading">
        <h2 className="o-dasboard__title">Agents</h2>
      </div>
      <div className="o-dasboard__rightbody">
        {/* Add Agent Section */}
        <div className="add-agent">
          <div className="image-area">
            <div className="image-width">
              <img src={addAgentImage} alt="add agent" />
            </div>
            <div className="image-content">
              <h5>Add a new agent</h5>
              <p>You can add inbound or outbound agents from the list</p>
            </div>
          </div>
          <Link to="/admin/agents/super-agent-add" className="btn">
            <span>
              ADD AGENT
              <RightArrowIcon />
            </span>
          </Link>
        </div>

        {/* Agent Calls Section */}
        <div className="agent-calls">
          {/* Inbound Agents */}
          <InbountAgentCard />

          {/* Outbound Agents */}
          <OutboundAgentCard />
        </div>
      </div>
    </div>
  );
};

export default AgentsDashboard;
