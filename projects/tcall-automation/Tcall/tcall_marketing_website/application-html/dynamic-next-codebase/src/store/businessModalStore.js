import { create } from "zustand";

// Create Zustand store
const useBusinessApprovalStore = create((set) => ({
  isOpen: false,
  setIsOpen: (value) => set({ isOpen: value }),
}));

export default useBusinessApprovalStore;
