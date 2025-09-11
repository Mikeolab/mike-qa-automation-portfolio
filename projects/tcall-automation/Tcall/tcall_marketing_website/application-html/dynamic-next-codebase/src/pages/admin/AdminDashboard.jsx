import { Link, useNavigate } from "react-router-dom";
import SuperAdminImages from "../../assets/images/super-admin-images.svg";
import DashStatusIcon from "../../assets/images/dash-status-icon.svg";
import DashPhoneLargeIcon from "../../assets/images/dash-phone-large.svg";
import DashUserListIcon from "../../assets/images/dash-user-list.svg";
import DashPurchaseNumberIcon from "../../assets/images/dash-purchase-number.svg";
import Avatar from "../../components/shared/Avatar";
import useAuthStore from "../../store/authStore";
import { useClientDetailsQuery } from "../../hooks/api/useGetClientDetailsQuery";

export const AdminDashboard = () => {
  const { data, isLoading } = useClientDetailsQuery();
  const { user } = useAuthStore();

  return (
    <div className="o-dasboard__rightbar o-dasboard__rightbar--doctordash">
      <div className="o-dasboard__rightheading">
        <h2 className="o-dasboard__title">Dashboard</h2>
      </div>
      <div className="o-dasboard__rightbody flex-body flex-div-ends">
        <img
          src={SuperAdminImages}
          alt="dashboard microphone"
          className="o-dasboard__pointimage"
        />
        <ul className="o-dasboard__dlist">
          <li className="o-dasboard__ditem o-dasboard__ditem--large">
            <Link
              to={"/admin/dashboard-personal-details"}
              className="o-dasboard__dflink"
            >
              <div className="o-dasboard__ditems">
                <div className="o-dasboard__ditemstop">
                  <div className="user-image">
                    <Avatar />
                  </div>
                  <div className="user-details">
                    <h6>Personal Details</h6>
                    <label>Name</label>
                    <p>{user?.full_name}</p>
                    <div className="o-dasboard__ditemsbottom">
                      <span>
                        VIEW DETAIL
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 12H19"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 5L19 12L12 19"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </li>
          <li className="o-dasboard__ditem o-dasboard__ditem--before o-dasboard__ditem--small">
            <Link
              to="/admin/dashboard-personal-status"
              className="o-dasboard__dslink"
            >
              <img src={DashStatusIcon} alt="dashboard Status" />
              <span>Status</span>
            </Link>
          </li>
        </ul>
        <div className="o-dasboard__dlistwrapper  splide js-ditem-slider">
          <div className="splide__track">
            <ul className="o-dasboard__dlist1 splide__list">
              <li className="o-dasboard__ditem o-dasboard__ditem--before o-dasboard__ditem--small splide__slide">
                <Link
                  to="/admin/dashboard/dashboard-purchase-number"
                  className="o-dasboard__dslink"
                >
                  <img src={DashPhoneLargeIcon} alt="dashboard phone" />
                  <span>BUY PHONE NUMBER</span>
                </Link>
              </li>
              <li className="o-dasboard__ditem o-dasboard__ditem--before o-dasboard__ditem--small splide__slide">
                <Link
                  to={"/admin/dashboard/dashboard-purchase-phone-number"}
                  className="o-dasboard__dslink"
                  state={{ message: "" }}
                >
                  <img src={DashPurchaseNumberIcon} alt="Account Balence" />
                  <span>PURCHASED NUMBER</span>
                </Link>
              </li>
              <li className="o-dasboard__ditem o-dasboard__ditem--before o-dasboard__ditem--small splide__slide">
                <Link
                  to="/admin/dashboard-user-list"
                  className="o-dasboard__dslink"
                >
                  <div className="newrequerst">
                    <span></span>New Request
                  </div>
                  <img src={DashUserListIcon} alt="Purchase Number" />
                  <span>View Users</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
