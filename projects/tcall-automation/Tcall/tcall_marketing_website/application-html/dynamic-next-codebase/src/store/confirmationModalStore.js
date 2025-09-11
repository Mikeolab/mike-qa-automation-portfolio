import { create } from "zustand";
const useConfirmationModalStore = create((set) => ({
  isOpen: false,
  selectedId: null,
  selectedClientId: null,
  modalType: "", // 'delete' or 'update'
  setIsOpen: (isOpen) => set({ isOpen }),
  setSelectedId: (selectedId) => set({ selectedId }),
  setSelectedClientId: (selectedClientId) => set({ selectedClientId }),
  setModalType: (modalType) => set({ modalType }),
  resetModal: () =>
    set({
      isOpen: false,
      selectedId: null,
      selectedClientId: null,
      modalType: "",
    }),
}));
export default useConfirmationModalStore;
