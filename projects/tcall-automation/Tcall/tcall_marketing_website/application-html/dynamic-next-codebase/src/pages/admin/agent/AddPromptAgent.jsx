import { useEffect } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import agentPromptedImage from "../../../assets/images/agent-prompt-back.svg"; // Importing image
import StepIndicator from "../../../components/shared/StepIndicator";
import useCreateAgentStore from "../../../store/createAgentStore";
import { useGetPreMadePromptsQuery } from "../../../hooks/api/useGetPreMadePromptsQuery";
import { useGetClientListDropdownQuery } from "../../../hooks/api/useGetClientListDropdownQuery";
import RightArrowIcon from "../../../components/icons/RightArrowIcon";
import { useGetAgentPremadePromptQuery } from "../../../hooks/api/useGetAgentPremadePromptQuery";
import { useCreateAgentMutation } from "../../../hooks/api/useCreateAgentMutation";
import { DEFAULT_VOICE_MODEL } from "../../../lib/constants";
import { useGetLLMModelListQuery } from "../../../hooks/api/useGetLLMModelListQuery";
import { useUpdateAgentDetailsMutation } from "../../../hooks/api/useUpdateAgentDetailsMutation";
import { useGetAgentDetailsQuery } from "../../../hooks/api/useGetAgentDetailsQuery";
import useAuthStore from "../../../store/authStore";
import FilterAgentsByClient from "../../../components/admin/FilterAgentsByClient";

const validatePayload = (payload, user) => {
  const requiredFields = {
    name: "Agent name",
    initial_message: "Initial message",
    language: "Language",
    pre_made_prompts: "Industry",
    prompts_title: "Industry title",
    prompts: "Prompt",
    task_prompt: "Task prompt",
    voice_id: "Voice ID",
    voice_model: "Voice model",
    // client: "Client",
  };
  if (user && user?.role === "Admin") {
    requiredFields.client = "Client";
  }

  console.log({ requiredFields, user });
  for (const [key, label] of Object.entries(requiredFields)) {
    if (!payload[key]) {
      toast.error(`${label} is required`);
      return false;
    }
  }
  return true;
};

const AddPromptAgent = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const agentId = queryParams.get("agentId");
  const isInbound = queryParams.get("is_inbound");
  const prompts_title = queryParams.get("prompts_title");
  const {
    is_inbound,
    selectedAgent,
    language,
    // phone, // TODO: in next version
    // transferToName, // TODO: in next version
    client,
    initialMessage,
    prompt,
    preMadePrompt,
    task_prompt,
    setClient,
    setInitialMessage,
    setPrompt,
    setPreMadePrompt,
    setTaskPrompt,
    reset,
  } = useCreateAgentStore();
  const { data: preMadePrompts } = useGetPreMadePromptsQuery({ is_inbound });

  const { data: clientListDropdown } = useGetClientListDropdownQuery({
    enabled: user && user?.role === "Admin",
    per_page: -1,
  });
  const { data: premadePromptData } = useGetAgentPremadePromptQuery(
    preMadePrompt,
    {
      enabled: !!preMadePrompt, // Only runs when preMadePrompt has a value
    }
  );

  const { data: agentDetails } = useGetAgentDetailsQuery(agentId, {
    enabled: !!agentId,
  });

  const { data: gpt4oId } = useGetLLMModelListQuery();

  // Add these new functions
  const renderEditablePrompt = () => {
    if (!prompt) return "";

    // Split by both single and double curly braces
    const segments = prompt.split(/(\{\{[^{}]*\}\}|\{[^{}]*\})/g);

    return segments.map((segment, index) => {
      // Check for double curly braces first
      if (segment.startsWith("{{") && segment.endsWith("}}")) {
        return <span key={index}>{segment}</span>;
      }

      // Then check for single curly braces
      const isEditable = segment.startsWith("{") && segment.endsWith("}");
      if (isEditable) {
        return (
          <input
            key={index}
            type="text"
            value={segment.slice(1, -1)} // Remove curly braces
            onChange={(e) => handleEditableSegment(index, e.target.value)}
            className="editable-segment"
          />
        );
      }
      return <span key={index}>{segment}</span>;
    });
  };

  const handleEditableSegment = (index, newValue) => {
    // Split by both single and double curly braces
    const segments = prompt.split(/(\{\{[^{}]*\}\}|\{[^{}]*\})/g);
    segments[index] = `{${newValue}}`;
    setPrompt(segments.join(""));
  };

  const createAgentMutation = useCreateAgentMutation({
    onSuccess: async (data) => {
      toast.success("Agent created successfully");
      navigate("/admin/dashboard-user-list");
      reset();
      // console.log("agent created", data);
      // with this data.data.agent_id and phone && transferToName data call the below api
      // TODO: in next version
      // try {
      //   const response = await addCallTransferDetailsAPI({
      //     to_name: transferToName,
      //     mobile_no: phone,
      //     agent: data.data.id,
      //   });
      //   console.log("call transfer details added", response);
      //   navigate("/admin/dashboard-user-list");
      //   reset();
      // } catch (error) {
      //   console.log("error in call transfer details", error);
      //   toast.error("Error in call transfer details");
      // }
    },
    onError: (error) => {
      console.log({ error });
      // Check for HTTP status codes and provide user feedback
      if (error.response) {
        const statusCode = error.response.data.statusCode;
        if (statusCode === 400) {
          toast.error(error.response.data.message);
        } else if (statusCode === 500) {
          toast.error(error.response.data.message);
        } else {
          toast.error(
            `An unexpected error occurred: ${
              error.response.data?.message || "Error"
            }`
          );
        }
      } else {
        toast.error("Network error. Please check your internet connection.");
      }
    },
  });

  const updateAgentDetailsMutation = useUpdateAgentDetailsMutation({
    onSuccess: async (data) => {
      toast.success("Agent updated successfully");
      navigate(
        user?.role === "Admin"
          ? "/admin/agent-inbound-list"
          : "/customer/agents"
      );
      reset();
    },
    onError: (error) => {
      console.log({ error });
      // Check for HTTP status codes and provide user feedback
      if (error.response) {
        const statusCode = error.response.data.statusCode;
        if (statusCode === 400) {
          toast.error(error.response.data.message);
        } else if (statusCode === 500) {
          toast.error(error.response.data.message);
        } else {
          toast.error(
            `An unexpected error occurred: ${
              error.response.data?.message || "Error"
            }`
          );
        }
      } else {
        toast.error("Network error. Please check your internet connection.");
      }
    },
  });

  const handleCreateAgent = () => {
    const labelOfSelectedPrompt = preMadePrompts?.find(
      (prompt) => Number(prompt.value) === Number(preMadePrompt)
    )?.label;

    const payload = {
      name: selectedAgent?.voice_name,
      initial_message: initialMessage,
      language,
      pre_made_prompts: Number(preMadePrompt), // industry id
      prompts_title: labelOfSelectedPrompt,
      prompts: prompt,
      task_prompt,
      is_inbound,
      voice_id: selectedAgent?.voice_id,
      retell_llm_model: gpt4oId,
      is_for_homepage: false,
      voice_model: DEFAULT_VOICE_MODEL,
      client: client?.value,
    };

    // handle validation I want to check if the payload is valid, make sure to show a toast messsage of which field is missing

    // TODO: in next version
    // if (!phone || !transferToName) {
    //   toast.error("Phone and Transfer to name are required in step 3.");
    //   return;
    // }

    if (validatePayload(payload, user)) {
      console.log("payload is valid");
      createAgentMutation.mutate(payload);
    }

    // createAgentMutation.mutate({
    //   agent_name: "test",
    //   voice_id: "1",
    //   language_id: "1",
    // });
  };

  const handleUpdateAgent = () => {
    console.log("update agent");
    const labelOfSelectedPrompt = preMadePrompts?.find(
      (prompt) => Number(prompt.value) === Number(preMadePrompt)
    )?.label;

    const payload = {
      name: selectedAgent?.voice_name,
      initial_message: initialMessage,
      language,
      pre_made_prompts: Number(preMadePrompt), // industry id
      prompts_title: labelOfSelectedPrompt,
      prompts: prompt,
      task_prompt,
      is_inbound,
      voice_id: selectedAgent?.voice_id,
      retell_llm_model: gpt4oId,
      is_for_homepage: false,
      voice_model: DEFAULT_VOICE_MODEL,
      client: client?.value,
    };

    if (validatePayload(payload, user)) {
      console.log("payload is valid");
      // TODO: update agent
      const body = {
        id: agentId,
        payload,
      };
      updateAgentDetailsMutation.mutate(body);
    }
  };

  useEffect(() => {
    if (agentDetails?.data?.id && agentDetails?.data?.prompts_title) {
      // Check if data is available means EDIT MODE
      const labelOfSelectedPrompt = preMadePrompts?.find(
        (prompt) => Number(prompt.value) === Number(preMadePrompt)
      )?.label;
      if (labelOfSelectedPrompt === prompts_title) {
        // When dropdown name is same as already saved name, then show the old saved prompt

        setPrompt(agentDetails?.data?.prompts);
        setTaskPrompt(agentDetails?.data?.task_prompt);
      } else {
        // This is required as after prefilling the user can change the dropdown value, then we need to override with changed value
        setPrompt(premadePromptData?.data?.description);
        setTaskPrompt(premadePromptData?.data?.state_prompt);
      }
    } else {
      // CREATE MODE
      setPrompt(premadePromptData?.data?.description);
      setTaskPrompt(premadePromptData?.data?.state_prompt);
    }
  }, [premadePromptData, agentDetails, preMadePrompts]);

  useEffect(() => {
    console.log({ clientListDropdown });
    if (clientListDropdown && clientListDropdown?.length > 0) {
      const matchedClient = clientListDropdown?.find(
        (item) => item?.value === agentDetails?.data?.client
      );
      setClient(matchedClient);
      console.log({ matchedClient });
    }
  }, [clientListDropdown, agentDetails]);

  return (
    <div className="o-dasboard__rightbar">
      <div className="o-dasboard__rightheading">
        <h2 className="o-dasboard__title">
          {agentId ? "Update Agents" : "Add Agents"}
        </h2>
      </div>
      <div className="o-dasboard__rightbody">
        <div className="agent-wrapper">
          {/* Step Indicator */}
          <StepIndicator
            currentStep={user?.role === "Admin" ? (agentId ? 3 : 4) : 2}
            agentId={agentId}
            isInbound={isInbound}
            prompts_title={prompts_title}
          />

          {/* Form */}
          <form>
            <div className="agent-wrapper__bottombox agent-wrapper__bottombox--prompt agent-wrapper__bottombox--superprompt">
              {/* Image Section */}
              <div className="agent-wrapper__imagepart agent-wrapper__imagepart--prompted">
                <img src={agentPromptedImage} alt="Agent Prompted" />
              </div>

              {/* Language and Prompt Section */}
              <div className="agent-wrapper__languagecontent">
                <div className="agent-wrapper__selectlanguage agent-wrapper__selectlanguage--prompt">
                  {/* Industry Selection */}
                  <div className="agent-wrapper__from-group">
                    <label>Industry</label>
                    <select
                      className="agent-wrapper__input-form agent-wrapper__input-form--select"
                      value={preMadePrompt}
                      onChange={(e) => setPreMadePrompt(e.target.value)}
                    >
                      <option value="">Select Pre-made Prompt</option>
                      {preMadePrompts?.map((prompt) => (
                        <option key={prompt.value} value={prompt.value}>
                          {prompt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {user?.role === "Admin" && (
                    <div className="agent-wrapper__from-group">
                      <label>Select Client</label>

                      {/* <select
                        className="agent-wrapper__input-form agent-wrapper__input-form--select"
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                      >
                        <option value="">Select Client</option>
                        {clientListDropdown?.map((client) => (
                          <option key={client.value} value={client.value}>
                            {client.label}
                          </option>
                        ))}
                      </select> */}
                      <FilterAgentsByClient
                        value={client}
                        onChange={setClient}
                        showLabel={false}
                        parentClassName="agent-wrapper__from-group"
                        selectClass="agent-wrapper__input-form agent-wrapper__input-form--select"
                      />
                    </div>
                  )}

                  <div className="agent-wrapper__from-group agent-wrapper__from-group--full">
                    <label>Initial Message</label>
                    <textarea
                      className="agent-wrapper__input-form agent-wrapper__input-form--textarea"
                      placeholder="Initial Message"
                      value={initialMessage}
                      onChange={(e) => setInitialMessage(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Prompt Textarea */}
                  <div className="agent-wrapper__from-group agent-wrapper__from-group--full">
                    <label>Prompt</label>
                    <div className="prompt-scroll-container">
                      <div className="agent-wrapper__input-form agent-wrapper__input-form--textarea editable-prompt-container">
                        {renderEditablePrompt()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Agent Button */}
              <div className="agent-wrapper__bottombtn">
                <button
                  type="button"
                  className="dig-button"
                  onClick={agentId ? handleUpdateAgent : handleCreateAgent}
                >
                  <span>
                    {agentId ? "UPDATE AGENT" : "SAVE AGENT"}
                    <RightArrowIcon />
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPromptAgent;
