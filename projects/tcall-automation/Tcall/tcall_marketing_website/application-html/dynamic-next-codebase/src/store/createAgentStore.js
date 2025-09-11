import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCreateAgentStore = create(
  persist(
    (set) => ({
      is_inbound: true, // 'inbound' or 'outbound'
      selectedAgent: null,
      language: "en-US",
      // phone: "", // TODO: in next version
      // transferToName: "", // TODO: in next version
      client: "",
      initialMessage: "",
      prompt: "",
      preMadePrompt: null,
      task_prompt: "",

      // Actions
      setIsInbound: (isInbound) => set({ is_inbound: isInbound }),
      setSelectedAgent: (agent) => set({ selectedAgent: agent }),
      setLanguage: (language) => set({ language }),
      // setPhone: (phone) => set({ phone }),
      // setTransferToName: (transferToName) => set({ transferToName }),
      setClient: (client) => set({ client }),
      setInitialMessage: (initialMessage) => set({ initialMessage }),
      setPrompt: (prompt) => set({ prompt }),
      setPreMadePrompt: (preMadePrompt) => set({ preMadePrompt }),
      setTaskPrompt: (taskPrompt) => set({ task_prompt: taskPrompt }),

      // Reset store
      reset: () =>
        set({
          is_inbound: true,
          selectedAgent: null,
          language: "en-US",
          // phone: "",
          // transferToName: "",
          client: "",
          initialMessage: "",
          prompt: "",
          preMadePrompt: null,
          task_prompt: "",
        }),
    }),
    {
      name: "agent-creation-storage", // unique name for localStorage
    }
  )
);

export default useCreateAgentStore;
