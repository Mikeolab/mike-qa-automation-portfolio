import React, { useEffect, useState } from "react";

import Modal from "react-modal";
import { IoClose } from "react-icons/io5"; // Add this import at the top
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useBusinessApprovalStore from "../../store/businessModalStore";
import { useApproveBusinessMutation } from "../../hooks/api/useApproveBusinessMutation";
import { agentAssignToPurchaseNumberAPI } from "../../services/admin/agentAssignToPurchaseNumber";

// Modal styles - keeping minimal styles for positioning only
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0",
    border: "none",
    background: "transparent",
    zIndex: 1000, // Add z-index
    position: "relative", // Ensure proper stacking context
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999, // Add z-index
  },
};
Modal.setAppElement("#root");
export default function BusinessApprovalModal({
  data,
  isLoading,
  isError,
  onAction,
  onCancel,
}) {
  const navigate = useNavigate();
  const params = useParams();
  console.log(params);
  const { isOpen, setIsOpen } = useBusinessApprovalStore();
  const approveBusinessMutation = useApproveBusinessMutation({
    onSuccess: async () => {
      try {
        const response = await agentAssignToPurchaseNumberAPI({
          purchase_number: data?.data?.assigned_number_detail?.id,
          agent: data?.data?.agent_detail?.id,
        });

        toast.success("Business approved successfully");
        navigate("/admin/dashboard-user-list");
      } catch (error) {
        console.log("error in agent assign to purchase number", error);
        toast.error(error.response.data.message);
      }
    },
    onError: () => {
      toast.error("Failed to approve business");
    },
  });

  const [status, setStatus] = useState(data?.data?.status || "pending");

  if (!data) return null;
  console.log(data);

  const {
    id,
    name,
    mobile_no,
    client,
    email,
    address,
    address2,
    description,
    city,
    state,
    country,
    postal_code,
    business_domain_detail,
    assigned_number_detail,
    agent_detail,
    is_collection_created,
  } = data?.data;
  console.log({ client });

  const handleCancel = () => {
    setIsOpen(false);
    onCancel?.(); // Call onCancel if provided
  };

  const handleApprove = () => {
    approveBusinessMutation.mutate({
      id: params.businessId,
      body: {
        status,
      },
    });
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCancel}
      style={customStyles}
      contentLabel="Business Approval Modal"
    >
      <div className="bg-[#211F82] rounded-lg shadow-xl w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#312F9E] relative">
          <h2 className="text-xl font-semibold text-white">Business Detail</h2>
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <IoClose size={24} />
          </button>
        </div>
        {/* Content */}
        <div className="px-6 py-4">
          {isLoading && (
            <div className="text-white">Loading business details...</div>
          )}
          {isError && (
            <div className="text-red-200">Error loading business details</div>
          )}
          {data && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {/* Column 1 */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-indigo-200">
                    Business Name
                  </p>
                  <p className="text-sm text-[#fff] font-semibold">
                    {name || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-indigo-200">
                    Phone Number
                  </p>
                  <p className="text-sm text-[#fff] font-semibold">
                    {mobile_no || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-indigo-200">Email</p>
                  <p className="text-sm text-[#fff] font-semibold">
                    {email || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-indigo-200">
                    Business Domain
                  </p>
                  <p className="text-sm text-[#fff] font-semibold">
                    {business_domain_detail?.title || "N/A"}
                  </p>
                </div>
                {/* Column 2 */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-indigo-200">
                    Address 1
                  </p>
                  <p className="text-sm text-[#fff] font-semibold">
                    {address || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-indigo-200">
                    Address 2
                  </p>
                  <p className="text-sm text-[#fff] font-semibold">
                    {address2 || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-indigo-200">Country</p>
                  <p className="text-sm text-[#fff] font-semibold">
                    {country || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-indigo-200">City</p>
                  <p className="text-sm text-[#fff] font-semibold">
                    {city || "N/A"}
                  </p>
                </div>
                {/* Column 3 */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-indigo-200">State</p>
                  <p className="text-sm text-[#fff] font-semibold">
                    {state || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-indigo-200">
                    Zip/Postcode
                  </p>
                  <p className="text-sm text-[#fff] font-semibold">
                    {postal_code || "N/A"}
                  </p>
                </div>
              </div>
              {/* Other Detail */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-indigo-200">
                  Other Detail
                </p>
                <p className="text-sm text-[#fff] font-semibold">
                  {description || "N/A"}
                </p>
              </div>

              {/* Add here 3 call Grid with Columns Headering and Content */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm text-[#fff] font-semibold">
                  <h2 className="text-xl font-semibold text-white">
                    Assigned Number
                  </h2>
                  {assigned_number_detail ? (
                    assigned_number_detail?.number
                  ) : (
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/dashboard/dashboard-purchase-phone-number`,
                          {
                            state: { message: "business-approval" },
                          }
                        )
                      }
                      className="px-4 py-2 text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                    >
                      Select
                    </button>
                  )}
                </div>
                <div className="text-sm text-[#fff] font-semibold">
                  <h2 className="text-xl font-semibold text-white">
                    Create Agent
                  </h2>

                  {agent_detail ? (
                    agent_detail?.name
                  ) : (
                    <button
                      disabled={!assigned_number_detail}
                      className="disabled:cursor-not-allowed px-4 py-2 text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                      onClick={() => navigate(`/admin/agents/super-agent-add`)}
                    >
                      Select
                    </button>
                  )}
                </div>
                {data.data.status !== "approved" &&
                  assigned_number_detail &&
                  agent_detail && (
                    <div className="text-sm text-white">
                      <h2 className="text-xl font-semibold text-white">
                        Status
                      </h2>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="mt-2 block w-full px-3 py-2 text-indigo-700 bg-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                      </select>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
        {/* Footer */}
        {assigned_number_detail &&
          agent_detail &&
          business_domain_detail?.title === "Restaurant" &&
          !is_collection_created && (
            <div className="text-sm text-white">
              <h2 className="text-xl font-semibold text-white">
                Restaurant booking information update
              </h2>

              <button
                disabled={is_collection_created}
                className="disabled:cursor-not-allowed px-4 py-2 text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                onClick={() =>
                  window.open(
                    `https://dev.backend.tcall.ai/restaurant_booking_information_details/?client_id=${client}&business_id=${params.businessId}&agent_id=${data?.data?.agent_detail?.id}`,
                    "_blank"
                  )
                }
              >
                Select
              </button>
            </div>
          )}
        <div className="px-6 py-4 flex justify-start ">
          <button
            onClick={handleApprove}
            disabled={
              !assigned_number_detail ||
              !agent_detail ||
              status === "pending" ||
              !is_collection_created
            }
            className="disabled:cursor-not-allowed px-4 py-2 text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}
