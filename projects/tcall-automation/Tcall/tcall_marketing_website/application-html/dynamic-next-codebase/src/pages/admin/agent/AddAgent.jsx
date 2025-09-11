import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import agentMicrophone from "../../../assets/images/add-agency-microphone.svg";
import StepIndicator from "../../../components/shared/StepIndicator";
import useCreateAgentStore from "../../../store/createAgentStore";
import RightArrowIcon from "../../../components/icons/RightArrowIcon";

const AddAgents = () => {
  const navigate = useNavigate();
  const { setIsInbound, is_inbound } = useCreateAgentStore();
  const [radioValue, setRadioValue] = useState("inbound");

  return (
    <div className="o-dasboard__rightbar o-dasboard__rightbar--agentbar">
      <div className="o-dasboard__rightheading">
        <h2 className="o-dasboard__title">Add Agents</h2>
      </div>
      <div className="o-dasboard__rightbody">
        <div className="agent-wrapper">
          {/* Step Indicator */}
          <StepIndicator currentStep={1} />

          {/* Form */}
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="agent-wrapper__bottombox">
              {/* Image Section */}
              <div className="agent-wrapper__imagepart">
                <img src={agentMicrophone} alt="agency microphone" />
              </div>

              {/* Agent Type Selection */}
              <div className="agent-wrapper__areaselect">
                <label className="agent-wrapper__areaselectbox agent-wrapper__areaselectbox--inbound">
                  Inbound
                  <input
                    type="radio"
                    name="radio"
                    value="inbound"
                    checked={radioValue === "inbound"}
                    onChange={(e) => setRadioValue(e.target.value)}
                  />
                  <span className="checkmark"></span>
                </label>
                <label className="agent-wrapper__areaselectbox agent-wrapper__areaselectbox--outbound">
                  Outbound
                  <input
                    type="radio"
                    name="radio"
                    value="outbound"
                    checked={radioValue === "outbound"}
                    onChange={(e) => setRadioValue(e.target.value)}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="dig-button"
                onClick={() => {
                  setIsInbound(radioValue === "inbound");
                  navigate("/admin/agents/add-agent-voice");
                }}
              >
                <span>
                  SELECT VOICE AGENT
                  <RightArrowIcon />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAgents;
