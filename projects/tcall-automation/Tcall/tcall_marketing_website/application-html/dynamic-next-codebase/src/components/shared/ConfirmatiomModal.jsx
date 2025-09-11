import React from "react";

import Modal from "react-modal";
import { IoClose } from "react-icons/io5";
import useConfirmationModalStore from "../../store/confirmationModalStore";
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
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.25)", // Reduced opacity
    backdropFilter: "blur(1px)", // Added blur effect
    WebkitBackdropFilter: "blur(1px)", // For Safari support
    zIndex: 999,
  },
};
Modal.setAppElement("#root");
export default function ConfirmationModal({
  title,
  content,
  onSubmit,
  onClose,
  cancelText,
  confirmText,
  contentClassName,
  footerClassName,
}) {
  const { isOpen, setIsOpen } = useConfirmationModalStore();
  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };
  const handleSubmit = () => {
    setIsOpen(false);
    onSubmit?.();
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={customStyles}
      contentLabel="Confirmation Modal"
    >
      <div className="bg-[#211F82] rounded-lg shadow-xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#312F9E] relative">
          {title && (
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          )}
          <button
            onClick={handleClose}
            className={`absolute top-4 right-4 text-white/70 hover:text-white transition-colors`}
            aria-label="Close modal"
          >
            <IoClose size={24} />
          </button>
        </div>
        {/* Content */}
        <div className="px-6 py-4">
          <p className={`text-[#fff] ${contentClassName}`}>{content}</p>
        </div>
        {/* Footer */}
        <div className={`px-6 py-4 space-x-4 ${footerClassName}`}>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-[#fff] hover:bg-[#312F9E] border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
          >
            {cancelText}
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
