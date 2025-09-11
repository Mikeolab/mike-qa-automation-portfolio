import { Link } from "react-router-dom";
import agentIcon from "../../../assets/images/icons/agent-name1.png";

const AgentOutboundList = () => {
  return (
    <div className="o-dasboard__rightbar">
      <div className="o-dasboard__rightheading">
        <Link to="/admin/agents" className="o-dasboard__backbtn">
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.3867 12.2266H5.38672"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.3867 19.2266L5.38672 12.2266L12.3867 5.22656"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          BACK
        </Link>
      </div>
      <div className="o-dasboard__rightbody o-agentlist">
        <div className="o-agentlist__heading">
          <div className="o-agentlist__leftheading">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 2V8H22"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23 1L16 8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22.0001 16.9201V19.9201C22.0012 20.1986 21.9441 20.4743 21.8326 20.7294C21.721 20.9846 21.5574 21.2137 21.3521 21.402C21.1469 21.5902 20.9046 21.7336 20.6408 21.8228C20.377 21.912 20.0974 21.9452 19.8201 21.9201C16.7429 21.5857 13.7871 20.5342 11.1901 18.8501C8.77388 17.3148 6.72539 15.2663 5.19006 12.8501C3.50003 10.2413 2.4483 7.27109 2.12006 4.1801C2.09507 3.90356 2.12793 3.62486 2.21656 3.36172C2.30518 3.09859 2.44763 2.85679 2.63482 2.65172C2.82202 2.44665 3.04986 2.28281 3.30385 2.17062C3.55783 2.05843 3.8324 2.00036 4.11006 2.0001H7.11006C7.59536 1.99532 8.06585 2.16718 8.43382 2.48363C8.80179 2.80008 9.04213 3.23954 9.11005 3.7201C9.23668 4.68016 9.47151 5.62282 9.81006 6.5301C9.9446 6.88802 9.97372 7.27701 9.89396 7.65098C9.81421 8.02494 9.62892 8.36821 9.36005 8.6401L8.09006 9.9101C9.51361 12.4136 11.5865 14.4865 14.0901 15.9101L15.3601 14.6401C15.6319 14.3712 15.9752 14.1859 16.3492 14.1062C16.7231 14.0264 17.1121 14.0556 17.4701 14.1901C18.3773 14.5286 19.32 14.7635 20.2801 14.8901C20.7658 14.9586 21.2095 15.2033 21.5266 15.5776C21.8437 15.9519 22.0122 16.4297 22.0001 16.9201Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h4>My Outbound Agents list</h4>
          </div>
          <div className="o-agentlist__headsearch">
            <div className="form-groups">
              <label>Search by</label>
              <input
                type="text"
                className="input"
                placeholder="Agent name, Agent ID"
              />
            </div>
            <div className="form-groups">
              <label>Filter by</label>
              <select className="input input--select">
                <option selected>Select Client name</option>
              </select>
            </div>
          </div>
        </div>
        <ul className="o-agentlist__list">
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className="o-agentlist__item">
              <div className="o-agentlist__items o-agentlist__items--small">
                <i>
                  <img src={agentIcon} alt="user" />
                </i>
              </div>
              <div className="o-agentlist__items">
                <p>Agent name</p>
              </div>
              <div className="o-agentlist__items o-agentlist__items--small1">
                <p>Agent ID</p>
              </div>
              <div className="o-agentlist__items o-agentlist__items--small1">
                <p>Client name</p>
              </div>
              <div className="o-agentlist__items o-agentlist__items--small1">
                <p>Language</p>
              </div>
              <div className="o-agentlist__items o-agentlist__items--large">
                <a href="javascript:void(0)" className="view-agent">
                  VIEW AGENT
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AgentOutboundList;
