import { useEffect, useState } from "react";

import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import PhoneInput from "react-phone-input-2";
import usaIcon from "../../assets/images/icons/usa.png";
import { useGetClientListDropdownQuery } from "../../hooks/api/useGetClientListDropdownQuery";
import useConfirmationModalStore from "../../store/confirmationModalStore";
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/EditIcon";

import "react-phone-input-2/lib/style.css";
import FilterAgentsByClient from "./FilterAgentsByClient";

const PhoneListRow = ({ phone }) => {
  const {
    setIsOpen,
    setSelectedId,
    setSelectedClientId,
    setModalType,
    selectedId,
    selectedClientId,
  } = useConfirmationModalStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedClient, setSelectedClient] = useState(phone.client || "");

  // Reset local state when phone prop changes
  useEffect(() => {
    setSelectedClient(phone.client || "");
  }, [phone.client]);

  const { data: clientListDropdown, isPending } =
    useGetClientListDropdownQuery();

  const handleEditClick = () => {
    setSelectedId(phone.id);
    setIsEditMode(true);
    setSelectedClientId(phone.client || null); // start with whatever is selected currently
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setSelectedClient(phone.client || "");
    setSelectedClientId(null); // reset
    setSelectedId(null); // reset
  };

  const handleDelete = () => {
    setSelectedId(phone.id);
    setModalType("delete");
    setIsOpen(true);
  };

  const handleSaveEdit = () => {
    setSelectedId(phone.id);
    setSelectedClientId(selectedClient);
    setModalType("update");
    setIsOpen(true);
  };
  const handleSelectChange = (client, phone) => {
    setSelectedClient(client);
    setSelectedClientId(client?.value);
    setSelectedId(phone.id);
  };

  return (
    <div>
      <ul className="list-iems list-iems--number">
        <li>
          <span>Number</span>
          <PhoneInput
            value={phone.number}
            disabled
            inputStyle={{
              border: "none",
              outline: "none",
              background: "transparent",
              pointerEvents: "none",
              padding: "0",
              margin: "0",
              marginLeft: "25px", // Add space for the flag
            }}
            containerStyle={{
              display: "inline-block",
              position: "relative", // Ensure proper positioning
            }}
            buttonStyle={{
              border: "none",
              background: "transparent",
              padding: 0,
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)", // Center vertically
              pointerEvents: "none", // Make flag non-clickable
              cursor: "default",
            }}
            dropdownStyle={{ display: "none" }} // Hide dropdown completely
            enableAreaCodes={false}
            disableCountryCode={true}
            formatOnInit={false}
            disableDropdown={true} // Disable dropdown functionality
          />
        </li>
        <li>
          <div className="list-action custome-drop-down" data-tip={phone.client_name}>
            {phone.client && !isEditMode ? (
              <>
                <input
                  type="text"
                  className="edit-field"
                  value={phone.client_name}
                  disabled
                />
                {/* <a
                  href="javascript:void(0)"
                  className="actionbtn"
                  onClick={handleEditClick}
                >
                  <EditIcon />
                </a> */}
              </>
            ) : (
              <>
                <FilterAgentsByClient
                  value={selectedClient}
                  onChange={handleSelectChange}
                  phone={phone}
                  showLabel={false}
                />

                {isEditMode && (
                  <>
                    <a
                      href="javascript:void(0)"
                      className="actionbtn"
                      onClick={handleCancelEdit}
                    >
                      <RxCross2 size={16} />
                    </a>
                    <a
                      href="javascript:void(0)"
                      className="actionbtn"
                      onClick={handleSaveEdit}
                    >
                      <TiTick size={16} />
                    </a>
                  </>
                )}
              </>
            )}
          </div>
        </li>
        <li>
          <a
            href="javascript:void(0)"
            className="actionbtn"
            onClick={handleDelete}
          >
            <DeleteIcon />
          </a>
          {/* <button type="button" className="btn" disabled={!phone.is_assigned}>
            RELEASE
          </button> */}
        </li>
      </ul>
    </div>
  );
};
export default PhoneListRow;
