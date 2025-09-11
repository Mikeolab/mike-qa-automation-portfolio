import Modal from "react-modal";
import { IoClose } from "react-icons/io5";
import { toast } from "sonner";
import { useBuyPlanMutation } from "../../hooks/api/useBuyPlanMutation";
import { useNavigate } from "react-router-dom";
import RightArrowIcon from "../../components/icons/RightArrowIcon";

// Modal styles
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
    zIndex: 1000,
    position: "relative",
    width: "80%",
    height: "800px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
};

Modal.setAppElement("#root");

export default function BusinessApprovalModal({
  selectedPlan,
  closeModal,
  isModalOpen,
}) {
  const navigate = useNavigate();
  const buyPlanMutation = useBuyPlanMutation({
    onSuccess: (data) => {
      console.log({ planResponse: data });
      //   toast.success(data.message);
      navigate("/customer/dashboard/checkout-plan", { state: data.data });
      //   reset();
      //   closeModal();
    },
  });
  const handleBuyPlan = async () => {
    console.log({ selectedPlan });

    buyPlanMutation.mutate({
      amount: selectedPlan?.price,
      payment_type: "plan_purchase",
      plan_id: selectedPlan?.id,
    });
  };

  return (
    <>
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Plan Details Modal"
        className="h-[800px]"
      >
        <div
          className={`bg-[#2A1271] rounded-lg shadow-lg w-full max-w-md mx-auto p-6 o-general-dashboard__planitem--${selectedPlan?.type}`}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-5 ">
            <h2 className="text-xl font-bold text-white">
              {selectedPlan?.title}
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>
          <ul className="w-full">
            <li
              className={`${
                selectedPlan?.type === "business"
                  ? "o-general-dashboard__planitempopular"
                  : ""
              } o-general-dashboard__planitem--${
                selectedPlan?.type
              } w-full p-3 rounded-[16px]`}
            >
              <h3 className="o-general-dashboard__itemtitle">
                {selectedPlan?.title}
              </h3>
              <span className="o-general-dashboard__itemprice">
                {`$${selectedPlan?.price}/M`}
              </span>
              <p className="o-general-dashboard__itemplan">
                {selectedPlan?.description}
              </p>
              <ul className="o-general-dashboard__itemul">
                {selectedPlan?.features?.map((feature, index) => (
                  <li key={index} className="o-general-dashboard__itemli">
                    <svg width="15" height="16" viewBox="0 0 15 16" fill="none">
                      <g clipPath="url(#clip0_28_77630)">
                        <path
                          d="M13.7125 7.5354V8.08601C13.7118 9.37661 13.2939 10.6324 12.5211 11.6661C11.7484 12.6998 10.6622 13.456 9.42454 13.8219C8.18691 14.1878 6.86413 14.1439 5.65351 13.6966C4.44288 13.2494 3.40927 12.4227 2.70682 11.3401C2.00438 10.2574 1.67073 8.97661 1.75565 7.6888C1.84057 6.40099 2.3395 5.17514 3.17803 4.19405C4.01656 3.21297 5.14977 2.52923 6.40864 2.24481C7.66751 1.96038 8.9846 2.09051 10.1635 2.61579"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13.7125 3.29883L7.72761 9.28974L5.93213 7.49426"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_28_77630">
                          <rect
                            width="14.3638"
                            height="14.3638"
                            fill="white"
                            transform="translate(0.545898 0.90625)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex justify-center items-center gap-3">
                <div className="o-general-dashboard__planbtn o-login__btnarea">
                  <span>
                    <button className="o-login__button" onClick={closeModal}>
                      Cancel
                    </button>
                  </span>
                </div>
                <div className="o-general-dashboard__planbtn o-login__btnarea">
                  <span>
                    <button
                      type="submit"
                      className="o-login__button o-button--solid"
                      onClick={handleBuyPlan}
                    >
                      {buyPlanMutation.isPending ? (
                        "Loading..."
                      ) : (
                        <>
                          Check Out
                          <RightArrowIcon />
                        </>
                      )}
                    </button>
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </Modal>
    </>
  );
}
