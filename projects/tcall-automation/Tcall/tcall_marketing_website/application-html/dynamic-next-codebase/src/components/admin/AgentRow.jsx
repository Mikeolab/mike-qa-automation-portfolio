import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import agentIcon from "../../assets/images/icons/agent-name1.png";
import EditIcon from "../icons/EditIcon";
const EditAgentPhoneNumberModal = lazy(() =>
  import("./EditAgentPhoneNumberModal")
);

const AgentRow = ({ agent, isLoading, isInbound, refetchAgents }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleEdit = async () => {};
  const openModal = () => {
    console.log({ agentCLient: agent.client });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  console.log({ agent });
  if (isLoading) {
    return (
      <li className="o-agentlist__item animate-pulse">
        <div className="o-agentlist__items o-agentlist__items--small">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
        <div className="o-agentlist__items">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="o-agentlist__items o-agentlist__items--small1">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="o-agentlist__items o-agentlist__items--small1">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="o-agentlist__items o-agentlist__items--small1">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="o-agentlist__items o-agentlist__items--small1">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="o-agentlist__items o-agentlist__items--large">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </li>
    );
  }

  if (!agent) {
    return (
      <li className="o-agentlist__item justify-center">
        <p className="text-gray-500">No data found</p>
      </li>
    );
  }

  return (
    <li className="o-agentlist__item flex items-center space-x-4">
      <div className="o-agentlist__items o-agentlist__items--small flex-shrink-0">
        <i>
          <img src={agentIcon} alt="user" className="w-10 h-10" />
        </i>
      </div>
      <div
        className="o-agentlist__items flex-1 tooltip o-cusror-pointer "
        data-tooltip={agent.name}
      >
        <p className="truncate">{agent.name || "N/A"}</p>
      </div>
      <div
        className="o-agentlist__items o-agentlist__items--small1 flex-shrink-0 w-24 text-left tooltip o-cusror-pointer "
        data-tooltip={agent.agent_id}
      >
        <p className="truncate">{agent.agent_id || "N/A"}</p>
      </div>
      <div
        className="o-agentlist__items o-agentlist__items--small1 flex-shrink-0 w-28 text-left tooltip o-cusror-pointer "
        data-tooltip={agent.client_name}
      >
        <p className="truncate">{agent.client_name || "N/A"}</p>
        {/* <p className="truncate">{agent.client || "N/A"}</p> */}
      </div>
      <div
        className="o-agentlist__items o-agentlist__items--small1 flex-shrink-0 w-24 text-left tooltip o-cusror-pointer "
        data-tooltip={agent.language}
      >
        <p className="truncate">{agent.language || "N/A"}</p>
      </div>
      <div
        className="o-agentlist__items o-agentlist__items--small1 flex-shrink-0 w-28 text-left tooltip o-cusror-pointer flex justify-center items-center gap-3"
        data-tooltip={agent.assigned_number_detail?.assigned_number}
      >
        {/* {!agent.assigned_number_detail?.assigned_number ? (
          <input className="edit-field" />
        ) : ( */}
        <>
          <p className="truncate">
            {agent.assigned_number_detail?.assigned_number || "N/A"}
          </p>
          <a
            href="javascript:void(0)"
            className="actionbtn"
            onClick={openModal}
          >
            <EditIcon />
          </a>
        </>
        {/* )} */}
      </div>
      <div className="o-agentlist__items o-agentlist__items--large flex-shrink-0">
        <Link
          to={`/admin/agents/add-agent-voice?agentId=${agent.id}&is_inbound=${isInbound}`}
          className="view-agent inline-block bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600"
        >
          VIEW AGENT
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditAgentPhoneNumberModal
          modalIsOpen={modalIsOpen}
          toggleModal={closeModal}
          agent={agent}
          refetchAgents={refetchAgents}
        />
      </Suspense>
    </li>
  );
};

export default AgentRow;
