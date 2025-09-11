import { Link } from "react-router-dom";
import agentImage from "../../../assets/images/agent-add-language.svg";
import usaFlag from "../../../assets/images/icons/usa.png";

const AddAgents = () => {
  return (
    <div className="o-dasboard__rightbar">
      <div className="o-dasboard__rightheading">
        <h2 className="o-dasboard__title">Add Agents</h2>
      </div>
      <div className="o-dasboard__rightbody">
        <div className="agent-wrapper">
          <ul className="agent-wrapper__topindicator agent-wrapper__topindicator--agentdash">
            <li className="active">
              <Link to={"/customer/dashboard/add-agent-language"}>
                <span>1</span>
                Agent type
              </Link>
            </li>
            <li>
              <Link to={"/customer/dashboard/add-agent-voice"}>
                <span>2</span>
                Voice agent
              </Link>
            </li>
          </ul>
          <div className="agent-wrapper__bottombox agent-wrapper__bottombox--language">
            <div className="agent-wrapper__imagepart">
              <img src={agentImage} alt="agent microphone" />
            </div>
            <div className="agent-wrapper__languagecontent">
              <form>
                <div className="agent-wrapper__selectlanguage agent-wrapper__selectlanguage--agentdash">
                  <div className="agent-wrapper__from-group">
                    <label>Select Language</label>
                    <select className="agent-wrapper__input-form agent-wrapper__input-form--select">
                      <option selected>English</option>
                      <option>German</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                </div>
                <div className="agent-wrapper__selectlanguage agent-wrapper__selectlanguage--agentdash">
                  <div className="agent-wrapper__from-group">
                    <label>Transfer to name</label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      className="agent-wrapper__input-form"
                    />
                  </div>
                  <div className="agent-wrapper__from-group">
                    <label>Phone number for Call transfer</label>
                    <span className="agent-wrapper__groupphone">
                      <img src={usaFlag} alt="USA flag" />
                      <b>+1</b>
                      <input
                        type="text"
                        className="agent-wrapper__input-form agent-wrapper__input-form--phone"
                        placeholder=""
                      />
                    </span>
                  </div>
                </div>
                <div className="agent-wrapper__bottombtn">
                  <button type="submit" className="dig-button">
                    <span>
                      SELECT prompt
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

export default AddAgents;
