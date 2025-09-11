import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import { useGetAgentNumberListQuery } from "../../hooks/api/useGetAgentNumberListQuery";
import { getAgentNumberListAPI } from "../../services/admin/getAgentNumberListAPI";
import { IoClose } from "react-icons/io5";
import { useUpdateAgentNumberMutation } from "../../hooks/api/useUpdateAgentNumberMutation";
import { toast } from "sonner";

// Set the app element for accessibility (replace '#root' with your app's root element ID)
Modal.setAppElement("#root");

function EditAgentPhoneNumberModal({
  modalIsOpen,
  toggleModal,
  agent,
  refetchAgents,
}) {
  const { data, isPending, refetch } = useGetAgentNumberListQuery(
    {
      client: agent.client,
      //   is_already_assigned: agent?.assigned_number_detail?.assigned_number
      //     ? true
      //     : false,
    },
    {
      enabled:
        !!agent.client &&
        !!agent?.assigned_number_detail?.assigned_number &&
        !!modalIsOpen,
    }
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const [numberOptions, setNumberOptions] = useState([]);

  console.log({ agentData: data });

  const useUpdateAgentNumberMutate = useUpdateAgentNumberMutation({
    onSuccess: async (data) => {
      refetchAgents();
      toast.success("Number updated successfully");
      toggleModal();
      setSelectedOption(null);
    },
  });
  // Options for the react-select component
  const options = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
  ];

  const handleSelectChange = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to an API)
    console.log("Selected option:", selectedOption);
    useUpdateAgentNumberMutate.mutate({
      purchase_number: selectedOption?.value,
      agent: agent?.assigned_number_detail?.agent,
      id: agent?.assigned_number_detail?.id,
    });

    // toggleModal();
  };

  useEffect(() => {
    if (!isPending && data && data?.data) {
      setNumberOptions(
        data?.data?.map((item) => ({
          label: item?.number,
          value: item?.id,
        }))
      );
    }
  }, [data, isPending]);

  useEffect(() => {
    if (modalIsOpen && agent) {
      refetch();
    }
  }, [agent.client, modalIsOpen]);

  Modal.setAppElement("#root");
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={toggleModal}
        contentLabel="Edit Agent Phone Number"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Dimmed background
            zIndex: 1000,
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "600px", // Medium width
            height: "400px", // Medium height
            padding: "20px",
            borderRadius: "12px", // Rounded corners
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Add shadow
            background: "#2c66ab",
            color: "black",
          },
        }}
      >
        <div className="flex justify-between items center gap-5 relative">
          <h1 className="text-white text-2xl mb-5">Edit Agent Phone Number</h1>
          <p
            onClick={toggleModal}
            className=" text-white/70 hover:text-white transition-colors mb-5 cursor-pointer"
            aria-label="Close modal"
          >
            <IoClose size={24} />
          </p>
        </div>

        <h2 className="text-white mb-3">Select a Number</h2>
        <div>
          <div className="agent-wrapper__from-group">
            <Select
              value={selectedOption}
              onChange={handleSelectChange}
              options={numberOptions}
              placeholder="Choose an option..."
              //   className="agent-wrapper__input-form agent-wrapper__input-form--select"
            />
          </div>
          <div className="flex justify-center items-center gap-3 absolute bottom-10 right-52">
            <button
              onClick={handleSubmit}
              type="button"
              disabled={!selectedOption}
              className="disabled:cursor-not-allowed px-4 py-2 text-sm font-medium text-indigo-700 bg-blue-100 hover:bg-indigo-50 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-blue-bg-blue-100"
            >
              Submit
            </button>
            <button
              type="button"
              className="disabled:cursor-not-allowed px-4 py-2 text-sm font-medium text-indigo-700 bg-blue-100 hover:bg-indigo-50 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-blue-bg-blue-100"
              onClick={toggleModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EditAgentPhoneNumberModal;
