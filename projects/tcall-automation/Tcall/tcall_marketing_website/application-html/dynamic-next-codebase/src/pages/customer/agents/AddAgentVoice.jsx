import React from "react";
import agentPromptImage from "../../../assets/images/agent-prompt-back.svg";
import { Link } from "react-router-dom";

const AddAgentsVoice = () => {
  return (
    <div className="o-dasboard__rightbar">
      <div className="o-dasboard__rightheading">
        <h2 className="o-dasboard__title">Add Agents</h2>
      </div>
      <div className="o-dasboard__rightbody">
        <div className="agent-wrapper">
          <ul className="agent-wrapper__topindicator agent-wrapper__topindicator--agentdash">
            <li>
              <Link to={"/customer/dashboard/add-agent-language"}>
                <span>1</span>
                Agent type
              </Link>
            </li>
            <li className="active">
              <Link to={"/customer/dashboard/add-agent-voice"}>
                <span>2</span>
                Voice agent
              </Link>
            </li>
          </ul>
          <div className="agent-wrapper__bottombox agent-wrapper__bottombox--prompt">
            <div className="agent-wrapper__imagepart agent-wrapper__imagepart--prompted">
              <img src={agentPromptImage} alt="Agent Prompted" />
            </div>
            <div className="agent-wrapper__languagecontent">
              <form>
                <div className="agent-wrapper__selectlanguage agent-wrapper__selectlanguage--prompt">
                  <div className="agent-wrapper__from-group">
                    <label>Industry</label>
                    <select className="agent-wrapper__input-form agent-wrapper__input-form--select">
                      <option selected>Real Estate</option>
                      <option>Industry</option>
                      <option>Telecom</option>
                    </select>
                  </div>
                  <div className="agent-wrapper__from-group agent-wrapper__from-group--full">
                    <label>Prompt</label>
                    <textarea
                      className="agent-wrapper__input-form agent-wrapper__input-form--textarea"
                      placeholder="Prompt"
                    ></textarea>
                  </div>
                </div>
                <div className="agent-wrapper__bottombtn">
                  <button type="submit" className="dig-button">
                    <span>
                      SAVE
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 12H19"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 5L19 12L12 19"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAgentsVoice;
