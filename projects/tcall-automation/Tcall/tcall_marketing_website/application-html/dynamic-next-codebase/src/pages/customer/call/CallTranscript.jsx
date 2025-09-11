import React from "react";
// import backIcon from "../../../assets/images/icons/back-icon.svg"; // Replace with actual back icon path
import chatUserIcon from "../../../assets/images/icons/chat-user.svg"; // Replace with actual chat user icon path
import { Link } from "react-router-dom";

const CallTranscript = () => {
  return (
    <div className="o-dasboard__rightbar o-dasboard__rightbar--doctordash">
      {/* Back Button */}
      <Link to="/customer/dashboard" className="o-dasboard__backbtn">
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.3867 12.2266H5.38672"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M12.3867 19.2266L5.38672 12.2266L12.3867 5.22656"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        BACK
      </Link>

      <div className="o-dasboard__rightbody flex-body flex-div-start">
        <div className="o-general-dashboard__audiotranscriptouter">
          <div className="o-general-dashboard__audiotranscriptinner">
            {/* Header */}
            <h2 className="o-general-dashboard__innerheading">
              Audio Transcript
            </h2>
            <div className="o-general-dashboard__transcripthader">
              <input
                type="text"
                placeholder="Search transcript"
                className="search-input"
              />
              <a href="javascript:void(0)" className="extbtn">
                export
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M7 10L12 15L17 10"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M12 15V3"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </a>
            </div>

            {/* Transcript Chat List */}
            <ul className="o-general-dashboard__transchatul">
              {[...Array(4)].map((_, index) => (
                <li key={index} className="o-general-dashboard__transchatli">
                  <div className="o-general-dashboard__transchatlihead">
                    <p className="profile">
                      <span className="image">
                        <img src={chatUserIcon} alt="chat user" />
                      </span>
                      Tcall
                    </p>
                    <span className="time">13:08</span>
                  </div>
                  <p className="o-general-dashboard__trantext">
                    Hello how are you, I have some problem with my credit card.
                  </p>
                </li>
              ))}
            </ul>

            {/* Audio Player */}
            <div className="o-general-dashboard__audioplayer">
              <div className="audio-player">
                <div className="timeline">
                  <div className="progress"></div>
                </div>
                <div className="controls">
                  <div className="part">
                    <div className="name">LISTEN</div>
                    <div className="play-container">
                      <div className="toggle-play play"></div>
                    </div>
                  </div>
                  <div className="time">
                    <div className="current">0:00</div>
                    <div className="divider">/</div>
                    <div className="length"></div>
                  </div>
                  <div className="volume-container">
                    <div className="volume-button">
                      <div className="volume icono-volumeMedium"></div>
                    </div>
                    <div className="volume-slider">
                      <div className="volume-percentage"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallTranscript;
