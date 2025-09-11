import { useEffect } from "react";

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import languageImage from "../../../assets/images/agent-add-language.svg";
import usaFlag from "../../../assets/images/icons/usa.png";
import StepIndicator from "../../../components/shared/StepIndicator";
import useCreateAgentStore from "../../../store/createAgentStore";
import RightArrowIcon from "../../../components/icons/RightArrowIcon";
import { useGetAgentDetailsQuery } from "../../../hooks/api/useGetAgentDetailsQuery";
import useAuthStore from "../../../store/authStore";

import "react-phone-input-2/lib/style.css";

const AddAgentsLanguage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const agentId = queryParams.get("agentId");
  const isInbound = queryParams.get("is_inbound");
  const prompts_title = queryParams.get("prompts_title");

  console.log({ agentId, isInbound });
  const {
    is_inbound,
    selectedAgent,
    language,
    // phone,
    // transferToName,
    setLanguage,
    client,
    initialMessage,
    prompt,
    preMadePrompt,
    task_prompt,
    // setPhone,
    // setTransferToName,
    setSelectedAgent: setStoreSelectedAgent,
    // selectedAgent: storeSelectedAgent,
    setIsInbound,
    // setPhone: (phone) => set({ phone }), // TODO: In next phase
    // setTransferToName: (transferToName) => set({ transferToName }),
    setClient,
    setInitialMessage,
    setPrompt,
    setPreMadePrompt,
    setTaskPrompt,
  } = useCreateAgentStore();

  console.log(is_inbound, selectedAgent);
  // Add this handler
  // Update phone handler to use Zustand setter
  // const handlePhoneChange = (value) => {
  //   setPhone(value);
  // };

  // Add language change handler
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Add transfer name handler
  // const handleTransferNameChange = (e) => {
  //   setTransferToName(e.target.value);
  // };

  const { data: agentDetails } = useGetAgentDetailsQuery(agentId, {
    enabled: !!agentId,
  });

  // Required for Edit
  useEffect(() => {
    if (user?.role !== "Admin") {
      setIsInbound(isInbound === "true");
      if (typeof agentDetails?.data?.agent_voice_info === "string") {
        setStoreSelectedAgent(JSON.parse(agentDetails?.data?.agent_voice_info));
      } else {
        setStoreSelectedAgent(agentDetails?.data?.agent_voice_info);
      }
      setLanguage(agentDetails?.data?.language || language);
      setClient(agentDetails?.data?.client || client);
      setInitialMessage(agentDetails?.data?.initial_message || initialMessage);
      setPrompt(agentDetails?.data?.prompts || prompt);
      setPreMadePrompt(agentDetails?.data?.pre_made_prompts || preMadePrompt);
      setTaskPrompt(agentDetails?.data?.task_prompt || task_prompt);
    }
  }, [agentDetails, user]);

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
            currentStep={user?.role === "Admin" ? (agentId ? 2 : 3) : 1}
            agentId={agentId}
            isInbound={isInbound}
            prompts_title={prompts_title}
          />

          <div className="agent-wrapper__bottombox agent-wrapper__bottombox--language">
            {/* Image Section */}
            <div className="agent-wrapper__imagepart">
              <img src={languageImage} alt="Agent Language Selection" />
            </div>

            {/* Language and Phone Number Section */}
            <div className="agent-wrapper__languagecontent">
              <div className="agent-wrapper__selectlanguage">
                {/* Language Selection */}
                <div className="agent-wrapper__from-group">
                  <label>Select Language</label>
                  <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="agent-wrapper__input-form agent-wrapper__input-form--select"
                  >
                    <option value="en-US">English</option>
                    <option value="en-IN">English (India)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="de-DE">German</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                    <option value="it-IT">Italian</option>
                    <option value="ja-JP">Japanese</option>
                    <option value="multi">Multiple Languages</option>
                  </select>
                </div>

                {/* Phone Number for Call Transfer */}
                {/* TODO: in next version */}
                {/* <div className="agent-wrapper__from-group">
                    <label>Transfer to Name</label>

                    <input
                      type="text"
                      className="agent-wrapper__input-form agent-wrapper__input-form--phone"
                      placeholder=""
                      value={transferToName}
                      onChange={handleTransferNameChange}
                    />
                  </div>
                  <div className="agent-wrapper__from-group">
                    <label>Phone number for Call transfer</label>

                    <PhoneInput
                      country={"us"}
                      value={phone}
                      onChange={handlePhoneChange}
                      inputClass="agent-wrapper__input-form agent-wrapper__input-form--phone text-black"
                      containerClass="phone-input-container"
                    />
                  </div> */}
              </div>
            </div>

            {/* Submit Button */}
            <div className="agent-wrapper__bottombtn">
              <button
                className="dig-button"
                onClick={() => {
                  if (agentId) {
                    // editing
                    if (user?.role === "Admin") {
                      console.log("object if");
                      // return;
                      navigate(
                        `/admin/agents/add-agent-prompt/?agentId=${agentId}&is_inbound=${isInbound}&prompts_title=${
                          prompts_title
                            ? prompts_title
                            : agentDetails?.data?.prompts_title
                        }`
                      );
                    } else {
                      console.log("object else");
                      // return;
                      navigate(
                        `/customer/agents/add-agent-prompt/?agentId=${agentId}&is_inbound=${isInbound}&prompts_title=${
                          prompts_title
                            ? prompts_title
                            : agentDetails?.data?.prompts_title
                        }`
                      );
                    }
                  } else {
                    console.log("object");
                    navigate(
                      `/${
                        user?.role === "Admin" ? "admin" : "customer"
                      }/agents/add-agent-prompt`
                    );
                  }
                }}
              >
                <span>
                  SELECT prompt
                  <RightArrowIcon />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAgentsLanguage;
