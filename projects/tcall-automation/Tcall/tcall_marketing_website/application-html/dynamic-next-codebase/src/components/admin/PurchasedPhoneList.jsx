import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { useUpdatePurchaseMutation } from "../../hooks/api/useUpdatePurchaseMutation";
import useConfirmationModalStore from "../../store/confirmationModalStore";
import ConfirmationModal from "../shared/ConfirmatiomModal";
import PhoneListRow from "./PhoneListRow";
import RightArrowIcon from "../icons/RightArrowIcon";

const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-16 bg-gray-200 rounded-md mb-4"></div>
    <div className="h-16 bg-gray-200 rounded-md mb-4"></div>
    <div className="h-16 bg-gray-200 rounded-md"></div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-8">
    <p className="text-gray-500 text-lg">No phone numbers found</p>
  </div>
);

const PurchasedPhoneList = ({ response, isPending, searchParams }) => {
  const location = useLocation();
  const { state } = location || {};
  console.log({ state });
  const navigate = useNavigate();
  const {
    selectedId,
    setIsOpen,
    setSelectedId,
    selectedClientId,
    modalType,
    resetModal,
    setModalType,
  } = useConfirmationModalStore();

  const queryClient = useQueryClient();
  const updatePurchaseMutation = useUpdatePurchaseMutation({
    onSuccess: () => {
      const type = modalType;
      toast.success(
        modalType === "delete"
          ? "Phone number unassigned successfully"
          : "Phone number assigned successfully"
      );
      setIsOpen(false);
      resetModal();
      setModalType("");
      queryClient.invalidateQueries({
        queryKey: ["purchasedPhoneNumber", searchParams],
      });

      if (type === "new") {
        if (state?.message === "business-approval") {
          navigate("/admin/agents/super-agent-add");
        } else {
          navigate("/admin/dashboard/dashboard-purchase-phone-number");
        }
      }
    },
  });
  const handleUnassign = () => {
    updatePurchaseMutation.mutate({
      id: selectedId,
      payload: { is_unassign: true },
    });
  };

  const handleUpdateAssignedClient = () => {
    updatePurchaseMutation.mutate({
      id: selectedId,
      payload: { client: Number(selectedClientId) },
    });
  };

  const handleNewAssignment = () => {
    setModalType("new");
    setIsOpen(true);
  };
  console.log({ selectedClientId, selectedId });

  return (
    <div className="o-dasboard__listitems">
      {/* Header */}
      <ul className="list-title list-title--number">
        <li>Number</li>
        <li>Assigned client</li>
        <li></li>
      </ul>

      {/* Content */}
      {isPending ? (
        <LoadingSkeleton />
      ) : response?.count <= 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="">
            {response?.data?.map((phone) => (
              <PhoneListRow
                key={phone.id}
                phone={phone}
                searchParams={searchParams}
              />
            ))}

            {modalType === "new" && (
              <ConfirmationModal
                content="Are You Sure You Want To Proceed With This Number?"
                onSubmit={handleUpdateAssignedClient}
                onClose={() => {
                  setModalType("");
                }}
                cancelText="Cancel"
                confirmText={
                  state.message === "business-approval"
                    ? "Assign Number &  Create an Agent"
                    : "Assign"
                }
                contentClassName="text-center"
                footerClassName="flex justify-center"
              />
            )}

            {modalType === "delete" ? (
              <ConfirmationModal
                content="Are you sure you want to unassign this client?"
                onSubmit={handleUnassign}
                onClose={() => {
                  setModalType("");
                }}
                cancelText="Cancel"
                confirmText="Confirm"
                contentClassName="text-center"
                footerClassName="flex justify-center"
              />
            ) : (
              <ConfirmationModal
                content="Are you sure you want to update the assigned client?"
                onSubmit={handleUpdateAssignedClient}
                onClose={() => {
                  setModalType("");
                }}
                cancelText="Cancel"
                confirmText="Update"
                contentClassName="text-center"
                footerClassName="flex justify-center"
              />
            )}
          </div>
          <div className="pull-right">
            <button
              type="button"
              className="dig-button dig-button--small disabled:cursor-not-allowed disabled:opacity-0"
              onClick={handleNewAssignment}
              disabled={!selectedId || !selectedClientId}
            >
              <span>
                PROCEED
                <RightArrowIcon />
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
export default PurchasedPhoneList;
