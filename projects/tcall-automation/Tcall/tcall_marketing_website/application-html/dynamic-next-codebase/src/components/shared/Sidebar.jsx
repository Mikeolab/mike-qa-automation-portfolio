import { useLocation, Link } from "react-router-dom";
import DashboardIcon from "../icons/DashboardIcon";
import AgentsIcon from "../icons/AgentsIcon";
import CallIcon from "../icons/CallIcon";
import { isActiveTab } from "../../lib/isActiveTab";
import useAuthStore from "../../store/authStore";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <>
      <div className="o-dasboard__overlay"></div>
      <div className="o-dasboard__leftbar">
        <ul className="o-dasboard__leftlist">
          <li className="o-dasboard__leftitem">
            <DisabledLink
              to={
                user?.role === "Client"
                  ? "/customer/dashboard"
                  : "/admin/dashboard"
              }
              disabled={false} // Dashboard link is always enabled
              className={`o-cusror-pointer o-dasboard__leftitems ${isActiveTab(
                location.pathname,
                user?.role === "Client"
                  ? "/customer/dashboard"
                  : "/admin/dashboard"
              )}`}
            >
              <span className="o-dasboard__itemscenter tooltip">
                <DashboardIcon />
              </span>
              Dashboard
            </DisabledLink>
          </li>
          <li className="o-dasboard__leftitem">
            <DisabledLink
              to={
                user?.role === "Client" ? "/customer/agents" : "/admin/agents"
              }
              disabled={user?.role === "Client" && user?.status === "pending"} // Disable if Client and status is Pending
              className={`o-cusror-pointer o-dasboard__leftitems ${isActiveTab(
                location.pathname,
                user?.role === "Client" ? "/customer/agents" : "/admin/agents"
              )}`}
            >
              <span className="o-dasboard__itemscenter tooltip">
                <AgentsIcon />
              </span>
              Agents
            </DisabledLink>
          </li>
          <li className="o-dasboard__leftitem">
            <DisabledLink
              to={user?.role === "Client" ? "/customer/call" : "/admin/call"}
              disabled={user?.role === "Client" && user?.status === "pending"} // Disable if Client and status is Pending
              className={`o-cusror-pointer  o-dasboard__leftitems ${isActiveTab(
                location.pathname,
                user?.role === "Client" ? "/customer/call" : "/admin/call"
              )}`}
            >
              <span className="o-dasboard__itemscenter tooltip">
                <CallIcon />
              </span>
              Call
            </DisabledLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;

const DisabledLink = ({ to, disabled, children, className }) => {
  console.log({ to, disabled, children, className });
  return disabled ? (
    <span
      className={`${className} disabled-link`}
      style={{
        color: "gray",
        cursor: "not-allowed",
        pointerEvents: "none",
        opacity: 0.6, // Optional: Makes it visually distinct
      }}
      aria-disabled="true"
    >
      {children}
    </span>
  ) : (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
};
