import React, { useEffect, useLayoutEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import MyDashboardStockIcon from "../../assets/images/my-dashboard-stock.svg";
import DashCallIcon from "../../assets/images/dash-call.svg";
import DashAccountIcon from "../../assets/images/dash-account.svg";
import DashContactIcon from "../../assets/images/dash-contact.svg";
import { useGetBusinessDetailsQuery } from "../../hooks/api/useGetBusinessDetailsQuery";
import RightArrowIcon from "../../components/icons/RightArrowIcon";
import useAuthStore from "../../store/authStore";
import { useGetCustomerBalanceQuery } from "../../hooks/api/useGetCustomerBalanceQuery";
import { useClientDetailsQuery } from "../../hooks/api/useGetClientDetailsQuery";
const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    data: businessDetails,
    isPending,
    refetch: refetchBusinessDetails,
  } = useGetBusinessDetailsQuery();
  const { data, isPending: isPendingBalance } = useGetCustomerBalanceQuery();
  const { data: clientDetails, refetch: refetchClientDetails } =
    useClientDetailsQuery();

  useEffect(() => {
    refetchBusinessDetails();
    refetchClientDetails();
  }, []);

  useEffect(() => {
    console.log({ user, businessDetails, clientDetails });
    // Complete New Customer still not added business details
    if (!user?.is_business_detail && !businessDetails?.data) {
      return navigate("/customer/dashboard/add-business");
    }

    // Added business details, But still not approved by admin
    if (businessDetails && businessDetails?.data?.status === "pending") {
      return navigate("/customer/dashboard/approval-pending");
    }
    if (!clientDetails?.data?.is_active_plan) {
      return navigate("/customer/dashboard/pricing-plan");
    }
  }, [user, businessDetails, clientDetails]);

  if (isPending) {
    return <div>Checking your business details...</div>;
  }

  return (
    <div className="o-dasboard__rightbar o-general-dashboard">
      <div className="o-dasboard__rightheading">
        <h2 className="o-dasboard__title">Dashboard</h2>
      </div>
      <div className="o-dasboard__rightbody flex-body flex-div-ends">
        <img
          src={MyDashboardStockIcon}
          alt="My Dashboard"
          className="o-dasboard__pointimage"
        />

        <div className="o-general-dashboard__mydetails">
          <Link
            to="/customer/dashboard/business-details"
            className="o-general-dashboard__businessdetails"
          >
            <h4 className="o-general-dashboard__businessdetailstitle">
              Business detail
            </h4>
            <div className="o-general-dashboard__businessdetailsdetails">
              <div className="o-general-dashboard__businessdetailsleft">
                <div className="o-general-dashboard__businessdetailsgroup">
                  <label>Business name</label>
                  <p>{businessDetails?.data?.name}</p>
                </div>
                <div className="o-general-dashboard__businessdetailsgroup">
                  <label>Phone number</label>
                  <p>
                    {businessDetails?.data?.country_code}{" "}
                    {businessDetails?.data?.mobile_no}
                  </p>
                </div>
              </div>
              <div className="o-general-dashboard__businessdetailsright">
                <div className="o-general-dashboard__businessdetailsbtn o-cusror-pointer">
                  VIEW DETAIL
                  <RightArrowIcon />
                </div>
              </div>
            </div>
          </Link>
          <div className="o-general-dashboard__myboard">
            <div className="o-general-dashboard__myboardleft">
              <a
                href="javascript:void(0)"
                className="o-general-dashboard__dashcall"
              >
                <img src={DashCallIcon} alt="dash-call" />
                <h4>My Purchased number</h4>
                <p>{user?.purchsed_number}</p>
              </a>
            </div>
            <div className="o-general-dashboard__myboardright">
              <Link
                to="/customer/dashboard/add-balance"
                className="o-general-dashboard__accpro"
              >
                <img src={DashAccountIcon} alt="account baoance" />
                <div className="o-general-dashboard__daptext">
                  <h4>Account balance</h4>
                  <p>
                    {isPendingBalance ? "Loading..." : `$${data.data.balance}`}
                  </p>
                </div>
                <span className="o-general-dashboard__businessdetailsbtn">
                  Add Balance
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12H19"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M12 5L19 12L12 19"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
              </Link>
              <Link
                to={"/customer/dashboard/profile"}
                className="o-general-dashboard__accpro"
              >
                <img src={DashContactIcon} alt="account contact" />
                <div className="o-general-dashboard__daptext">
                  <h4>Personal details</h4>
                  <p>{user?.full_name}</p>
                </div>
                <span className="o-general-dashboard__businessdetailsbtn">
                  Add DETAIL
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12H19"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M12 5L19 12L12 19"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
