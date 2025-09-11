import { useState, useEffect, useCallback } from "react";

import { useInView } from "react-intersection-observer";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import voiceAgentImage from "../../../assets/images/agent-add-voice.png";
import agentNameImage from "../../../assets/images/icons/agent-name1.png";
import agentNameImage2 from "../../../assets/images/icons/agent-name3.png";
import waveImage from "../../../assets/images/wave-svg.svg";
import pauseVideoIcon from "../../../assets/images/icons/pause-video.svg";
import playVideoIcon from "../../../assets/images/icons/play-video.svg";
import StepIndicator from "../../../components/shared/StepIndicator";
import { getAgentsListAPI } from "../../../services/admin/getAgentsList";
import AgentVoiceSkeletonLoader from "./AgentVoiceSkeletonLoader";
import AudioWavePlayer from "../../../components/shared/AudioWebPlayer";
import RightArrowIcon from "../../../components/icons/RightArrowIcon";
import useCreateAgentStore from "../../../store/createAgentStore";
import EditIcon from "../../../components/icons/EditIcon";
import { agentData } from "../../../lib/agentData";
import { useGetAgentDetailsQuery } from "../../../hooks/api/useGetAgentDetailsQuery";

const AddAgentsVoice = () => {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const agentId = queryParams.get("agentId");
  const isInbound = queryParams.get("is_inbound");

  const { data: agentDetails } = useGetAgentDetailsQuery(agentId, {
    enabled: !!agentId,
  });

  const {
    setSelectedAgent: setStoreSelectedAgent,
    selectedAgent: storeSelectedAgent,
    setIsInbound,
    setLanguage,
    language,
    is_inbound, // 'inbound' or 'outbound'
    // phone: "", // TODO: in next version
    // transferToName: "", // TODO: in next version
    client,
    initialMessage,
    prompt,
    preMadePrompt,
    task_prompt,
    // setPhone: (phone) => set({ phone }), // TODO: In next phase
    // setTransferToName: (transferToName) => set({ transferToName }),
    setClient,
    setInitialMessage,
    setPrompt,
    setPreMadePrompt,
    setTaskPrompt,
  } = useCreateAgentStore();

  console.log("storeSelectedAgent", language);

  const [voiceAgents, setVoiceAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    per_page: 4,
  });
  // const [selectedAgent, setSelectedAgent] = useState(null);

  const { ref: lastElementRef, inView } = useInView({
    threshold: 0,
    // rootMargin: "50px 0px",
  });

  // Required for Edit
  useEffect(() => {
    setIsInbound(isInbound === "true");
    if (typeof agentDetails?.data?.agent_voice_info === "string") {
      setStoreSelectedAgent(JSON.parse(agentDetails?.data?.agent_voice_info));
    } else {
      setStoreSelectedAgent(agentDetails?.data?.agent_voice_info);
    }
    setLanguage(
      agentDetails?.data?.language ? agentDetails?.data?.language : language
    );
    setClient(agentDetails?.data?.client || client);
    setInitialMessage(agentDetails?.data?.initial_message || initialMessage);
    setPrompt(agentDetails?.data?.prompts || prompt);
    setPreMadePrompt(agentDetails?.data?.pre_made_prompts || preMadePrompt);
    setTaskPrompt(agentDetails?.data?.task_prompt || task_prompt);
  }, [agentDetails, voiceAgents]);

  // Fetch agents data
  const fetchAgents = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      //TODO: Uncomment this when API is ready
      const response = await getAgentsListAPI(searchParams);
      const newAgents = response.data.map((agent) => ({
        ...agent,
        editMode: false,
      }));

      setVoiceAgents((prev) => [...prev, ...newAgents]);
      setHasMore(newAgents.length === searchParams.per_page);
      setLoading(false);

      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      setLoading(false);
    }
  };

  // Add these new functions to handle editing
  const handleEditClick = (voiceId) => {
    setVoiceAgents((agents) =>
      agents.map((agent) => ({
        ...agent,
        editMode: agent.voice_id === voiceId ? true : false,
      }))
    );

    // updating the selected agent on edit click/ means before edit
    setStoreSelectedAgent(
      voiceAgents.find((agent) => agent.voice_id === voiceId)
    );
  };

  const handleNameChange = (voiceId, newName) => {
    const updatedVoiceAgents = voiceAgents.map((agent) =>
      agent.voice_id === voiceId ? { ...agent, voice_name: newName } : agent
    );
    setVoiceAgents(updatedVoiceAgents);
    console.log({ updatedVoiceAgents });
    setStoreSelectedAgent(
      updatedVoiceAgents?.find((agent) => agent?.voice_id === voiceId)
    );
  };

  const handleNameUpdate = (voiceId) => {
    setVoiceAgents((agents) =>
      agents.map((agent) => ({
        ...agent,
        editMode: agent.voice_id === voiceId ? false : false,
      }))
    );

    // updating the selected agent on name update/ means after edit
    setStoreSelectedAgent(
      voiceAgents.find((agent) => agent.voice_id === voiceId)
    );
    // setVoiceAgents((agents) =>
    //   agents.map((agent) =>
    //     agent.voice_id === voiceId
    //       ? { ...agent, voice_name: agent.tempName, editMode: false }
    //       : agent
    //   )
    // );
  };

  // Load more when last element is in view
  useEffect(() => {
    if (inView && hasMore && !isInitialLoad) {
      setSearchParams((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [inView, hasMore, isInitialLoad]);

  // Initial fetch
  useEffect(() => {
    fetchAgents();
  }, [searchParams]);

  const lastAgentElementRef = useCallback(
    (node) => {
      lastElementRef(node);
    },
    [lastElementRef]
  );

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
            currentStep={agentId ? 1 : 2}
            agentId={agentId}
            isInbound={isInbound}
            prompts_title={agentDetails?.data?.prompts_title}
          />

          {/* Form */}
          <form>
            <div className="agent-wrapper__bottombox agent-wrapper__bottombox--voicelist">
              {/* Image Section */}
              <div className="agent-wrapper__imgwidth">
                <img src={voiceAgentImage} alt="Agent Voice" />
              </div>

              {/* Voice Content */}
              <div className="agent-wrapper__voicecontent">
                <label className="voicenote-label">
                  Select any voice agent to proceed with the tone
                </label>
                <ul className="agent-wrapper__voicelist overflow-y-scroll">
                  {isInitialLoad ? (
                    <AgentVoiceSkeletonLoader />
                  ) : (
                    <>
                      {voiceAgents.map((agent, index) => (
                        <li
                          key={agent.voice_id}
                          ref={
                            index === voiceAgents.length - 1
                              ? lastAgentElementRef
                              : null
                          }
                          className="agent-wrapper__voiceitem"
                        >
                          <label className="agent-wrapper__voiceitems">
                            <input
                              type="radio"
                              name="radio"
                              checked={
                                storeSelectedAgent?.voice_id === agent.voice_id
                              }
                              onChange={() => setStoreSelectedAgent(agent)}
                            />

                            <span className="checkmark"></span>
                            <div className="agent-wrapper__itemsinside chkbody">
                              {agent.gender === "female" ? (
                                <i>
                                  <img
                                    src={agentNameImage}
                                    alt={agent.voice_name}
                                  />
                                </i>
                              ) : (
                                <i>
                                  <img
                                    src={agentNameImage2}
                                    alt={agent.voice_name}
                                  />
                                </i>
                              )}

                              <div>
                                {agent.editMode ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={agent.voice_name}
                                      onChange={(e) =>
                                        handleNameChange(
                                          agent.voice_id,
                                          e.target.value
                                        )
                                      }
                                      onBlur={() =>
                                        handleNameUpdate(agent.voice_id)
                                      }
                                      className="border rounded px-2 py-1 opacity-1 w-[150px]"
                                      style={{ opacity: 1 }}
                                    />
                                  </div>
                                ) : (
                                  <>
                                    <p>{agent.voice_name}</p>
                                    <button
                                      className="actionbtn"
                                      onClick={() =>
                                        handleEditClick(agent.voice_id)
                                      }
                                    >
                                      <EditIcon />
                                    </button>
                                  </>
                                )}
                              </div>

                              {/* Here add a Component that have audio and wave and I will pass audioSrc */}
                              {!agent.editMode && (
                                <AudioWavePlayer
                                  audioSrc={agent.preview_audio_url}
                                />
                              )}
                            </div>
                          </label>
                        </li>
                      ))}
                      {loading && (
                        <li className="text-center py-2">
                          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
                        </li>
                      )}
                    </>
                  )}
                </ul>
              </div>

              {/* Button */}
              <div className="agent-wrapper__bottombtn">
                <button
                  type="submit"
                  className="dig-button"
                  onClick={() => {
                    if (agentId) {
                      // editing
                      navigate(
                        `/admin/agents/add-agent-language?agentId=${agentId}&is_inbound=${isInbound}&prompts_title=${agentDetails?.data?.prompts_title}`
                      );
                    } else {
                      navigate("/admin/agents/add-agent-language");
                    }
                  }}
                >
                  <span>
                    SELECT Language
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

export default AddAgentsVoice;
