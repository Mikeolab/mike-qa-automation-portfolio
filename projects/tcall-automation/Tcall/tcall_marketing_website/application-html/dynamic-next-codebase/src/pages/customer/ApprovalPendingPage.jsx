import React, { useLayoutEffect } from "react";

import CustomerSupportBackIcon from "../../assets/images/cusomer-support-back.svg";
import ApprovalPendingIcon from "../../assets/images/approcal-pennding-stock.svg";
import { useGetBusinessDetailsQuery } from "../../hooks/api/useGetBusinessDetailsQuery";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const ApprovalPendingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: businessDetails, isPending } = useGetBusinessDetailsQuery();
  useLayoutEffect(() => {
    console.log({ user, businessDetails });
    // Complete New Customer still not added business details

    if (
      businessDetails &&
      businessDetails?.data?.status !== "pending" &&
      !user?.is_active_plan
    ) {
      return navigate("/customer/dashboard/pricing-plan");
    }
  }, [user, businessDetails]);

  if (isPending) {
    return <div>Checking your business details...</div>;
  }

  return (
    <div className="o-dasboard__rightbar o-general-dashboard">
      <div className="o-dasboard__rightbody flex-body flex-div-ends">
        <img
          src={CustomerSupportBackIcon}
          alt="Customar Support backend"
          className="o-dasboard__pointimage"
        />

        <div className="o-general-dashboard__approcal">
          <a
            href="javascript:void(0)"
            className="o-general-dashboard__approcaltag"
          >
            APPROVAL PENDING
          </a>
          <img src={ApprovalPendingIcon} alt="approcal pending" />
          <div className="o-general-dashboard__approcaltext">
            <h6>Your details have been submitted successfully for approval</h6>
            <p>
              It is under the process of approval. please visit after the admin
              review and give you the approval
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalPendingPage;
