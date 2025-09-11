import React, { useLayoutEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useAdminBusinessDetailsAPIQuery } from "../../hooks/api/useAdminBusinessDetailsAPIQuery";
import useBusinessApprovalStore from "../../store/businessModalStore";
import BusinessApprovalModal from "../../components/admin/BusinessApprovalModal";

export default function AdminBusinessApproval() {
  const navigate = useNavigate();
  const { businessId } = useParams();
  const { data, isLoading, isError } =
    useAdminBusinessDetailsAPIQuery(businessId);
  const { setIsOpen } = useBusinessApprovalStore();
  useLayoutEffect(() => {
    if (data) {
      setIsOpen(true);
    }
  }, [data, setIsOpen]);
  const handleCancel = () => {
    navigate("/admin/dashboard-user-list");
  };
  const handleAction = (data) => {
    // Handle approval action
    console.log("Approved:", data);
    navigate("/admin/dashboard-user-list");
  };
  return (
    <BusinessApprovalModal
      data={data}
      isLoading={isLoading}
      isError={isError}
      onAction={handleAction}
      onCancel={handleCancel}
    />
  );
}
