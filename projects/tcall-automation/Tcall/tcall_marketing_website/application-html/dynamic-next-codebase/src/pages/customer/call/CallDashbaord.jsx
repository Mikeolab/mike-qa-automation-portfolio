import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BackButton from "../../../components/shared/BackButton";
import { useGetCallHistoryQuery } from "../../../hooks/api/useGetCallHistoryQuery";
import SearchInput from "../../../components/admin/SearchInput";
import { useGetCallHistoryPromptQuery } from "../../../hooks/api/useGetCallHistoryPromptQuery";
import { formatDateTime, formatSeconds } from "../../../lib/formatDateAndTime";
import useAuthStore from "../../../store/authStore";
import Pagination from "../../../components/shared/Pagination";
import { DEFAULT_PAGE_SIZE } from "../../../lib/constants";

const MyCallsDashboard = () => {
  // const location = useLocation();
  const { user } = useAuthStore();
  // const [clientID, setClientID] = useState("");
  const [searchParams, setSearchParams] = useState({
    search: "",
    filter_by: "",
    start_date: "",
    page: 1,
  });

  // Replace single isPlaying state with a map of playing states
  const [playingStates, setPlayingStates] = useState({});
  const audioRefs = useRef({}); // Change to store multiple audio refs

  const { data, isPending, isError } = useGetCallHistoryQuery(searchParams);
  const { data: promptData, isLoading: promptLoading } =
    useGetCallHistoryPromptQuery(
      { client_id: user?.id },
      { enabled: !!user?.id }
    );

  // useEffect(() => {
  //   if (user) {
  //     setSearchParams({ ...searchParams, number: `${user?.purchased_number}` });
  //     setClientID(location?.state?.client);
  //   }
  // }, [user]);

  const handleSearchChange = (name, value) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };
  const handleFilterByChange = (filter_by) => {
    setSearchParams((prev) => ({ ...prev, filter_by }));
  };

  const handleDateChange = (name, start_date) => {
    setSearchParams((prev) => ({ ...prev, [name]: start_date }));
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePlayPause = (recordingUrl, callId) => {
    if (!audioRefs.current[callId]) {
      audioRefs.current[callId] = new Audio(recordingUrl);

      audioRefs.current[callId].addEventListener("ended", () => {
        setPlayingStates((prev) => ({ ...prev, [callId]: false }));
      });
    }

    if (playingStates[callId]) {
      audioRefs.current[callId].pause();
    } else {
      // Pause any currently playing audio
      Object.entries(audioRefs.current).forEach(([id, audio]) => {
        audio.pause();
        setPlayingStates((prev) => ({ ...prev, [id]: false }));
      });
      audioRefs.current[callId].play();
    }
    setPlayingStates((prev) => ({ ...prev, [callId]: !prev[callId] }));
  };

  return (
    <div className="o-dasboard__rightbar o-dasboard__rightbar--doctordash">
      <BackButton />
      <div className="o-dasboard__rightheading">
        <h2 className="o-dasboard__title">My Calls</h2>
      </div>
      <div className="o-dasboard__rightbody flex-body flex-div-start max-h-full">
        {/* Call Filters */}
        <div className="o-general-dashboard__callfilter">
          <h3 className="o-general-dashboard__callfiltertitle">Filter by</h3>
          <form>
            <div className="o-general-dashboard__callfiltergroup">
              {/* <label>Date</label> */}
              <SearchInput
                name="start_date"
                value={searchParams.start_date}
                onChange={handleDateChange}
                title={"Date"}
                className="input-type input-type--date"
                type="date"
              />
            </div>
            <div className="o-general-dashboard__callfiltergroup">
              <label>Call Duration</label>
              {[
                { id: 101, label: "less than 1 min" },
                { id: 102, label: "Between 1 to 3 min" },
                { id: 103, label: "Between 3 to 10 min" },
                { id: 104, label: "more than 10 min" },
              ].map((option) => (
                <p key={option.id}>
                  <input
                    type="radio"
                    id={option.id}
                    name="radio-group"
                    value={option.id}
                    checked={searchParams.filter_by === option.id}
                    onChange={() => handleFilterByChange(option.id)}
                  />
                  <label htmlFor={option.id}>{option.label}</label>
                </p>
              ))}
            </div>
            <div className="o-general-dashboard__callfiltergroup">
              <SearchInput
                name="search"
                value={searchParams.search}
                onChange={handleSearchChange}
                title={"number, Agent ID"}
                className="input-type"
              />
            </div>
          </form>
        </div>

        {/* Prompt for the Call */}
        <div className="o-general-dashboard__promtwrapper">
          <h3 className="o-general-dashboard__promthader">
            Prompt for the call
          </h3>
          <div className="o-general-dashboard__promptcall">
            <div className="o-general-dashboard__calldeading">
              <p className="title flex gap-2 justify-start items-center">
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
                  <path
                    d="M17.5734 13.4334V15.9334C17.5744 16.1655 17.5268 16.3952 17.4339 16.6079C17.3409 16.8205 17.2045 17.0114 17.0335 17.1683C16.8625 17.3252 16.6606 17.4447 16.4407 17.519C16.2209 17.5934 15.9879 17.621 15.7568 17.6001C13.1925 17.3214 10.7293 16.4452 8.5651 15.0417C6.55162 13.7623 4.84454 12.0552 3.5651 10.0417C2.15675 7.86775 1.2803 5.39258 1.00676 2.81675C0.985939 2.5863 1.01333 2.35405 1.08718 2.13477C1.16104 1.91549 1.27974 1.71399 1.43574 1.5431C1.59173 1.37221 1.7816 1.23567 1.99326 1.14218C2.20491 1.04869 2.43371 1.0003 2.6651 1.00008H5.1651C5.56952 0.9961 5.96159 1.13931 6.26823 1.40302C6.57487 1.66674 6.77516 2.03295 6.83176 2.43341C6.93728 3.23347 7.13297 4.01902 7.4151 4.77508C7.52722 5.07335 7.55148 5.39751 7.48502 5.70915C7.41856 6.02079 7.26415 6.30684 7.0401 6.53341L5.98176 7.59175C7.16806 9.67804 8.89548 11.4055 10.9818 12.5917L12.0401 11.5334C12.2667 11.3094 12.5527 11.155 12.8644 11.0885C13.176 11.022 13.5002 11.0463 13.7984 11.1584C14.5545 11.4405 15.34 11.6362 16.1401 11.7417C16.5449 11.7989 16.9146 12.0028 17.1789 12.3147C17.4432 12.6266 17.5836 13.0247 17.5734 13.4334Z"
                    stroke="#3D84DA"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{searchParams?.number}</span>
              </p>
              <Link
                to={`/customer/agents/add-agent-language?is_inbound=true&agentId=${promptData?.data?.id}`}
                className="editprompt"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.8348 2.26414C13.0331 2.06584 13.2685 1.90854 13.5276 1.80123C13.7867 1.69391 14.0644 1.63867 14.3448 1.63867C14.6253 1.63867 14.903 1.69391 15.1621 1.80123C15.4211 1.90854 15.6566 2.06584 15.8549 2.26414C16.0532 2.46244 16.2105 2.69785 16.3178 2.95694C16.4251 3.21602 16.4803 3.49371 16.4803 3.77415C16.4803 4.05458 16.4251 4.33227 16.3178 4.59136C16.2105 4.85045 16.0532 5.08586 15.8549 5.28416L5.66229 15.4767L1.50977 16.6092L2.64227 12.4567L12.8348 2.26414Z"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                EDIT PROMPT
              </Link>
            </div>
            <textarea
              className="o-general-dashboard__promtextarea"
              value={
                promptLoading
                  ? "Loading...."
                  : promptData && promptData?.data?.prompts
                  ? promptData?.data?.prompts
                  : "No prompt Found!"
              }
              readOnly
            />
          </div>
          {/* Call History */}
          <div className="o-general-dashboard__promptfilter">
            <h3 className="o-general-dashboard__promthader">
              Call history ({data?.count} Calls received)
            </h3>
            {/* <div className="datearea">
              <label>Sort by:</label>
              <input type="date" placeholder="Date" />
            </div> */}
          </div>

          {/* Call History Items */}
          <ul className="o-general-dashboard__promptfilterlist ">
            {data?.data?.map((callHistory, index) => (
              <li key={index} className="o-general-dashboard__promptfilteritem">
                <div className="o-general-dashboard__filteritemheader">
                  <p className="tag">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M13.166 1.83594V6.83594L18.166 6.83594"
                        stroke="#3D84DA"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19.1663 0.830078L13.333 6.66341"
                        stroke="#3D84DA"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.3332 14.0975V16.5975C18.3341 16.8296 18.2866 17.0593 18.1936 17.2719C18.1006 17.4846 17.9643 17.6755 17.7933 17.8324C17.6222 17.9893 17.4203 18.1087 17.2005 18.1831C16.9806 18.2574 16.7477 18.285 16.5165 18.2641C13.9522 17.9855 11.489 17.1093 9.32486 15.7058C7.31139 14.4264 5.60431 12.7193 4.32486 10.7058C2.91651 8.53181 2.04007 6.05664 1.76653 3.48081C1.7457 3.25037 1.77309 3.01811 1.84695 2.79883C1.9208 2.57955 2.03951 2.37805 2.1955 2.20716C2.3515 2.03627 2.54137 1.89973 2.75302 1.80624C2.96468 1.71276 3.19348 1.66436 3.42486 1.66414H5.92486C6.32928 1.66016 6.72136 1.80338 7.028 2.06709C7.33464 2.3308 7.53493 2.69702 7.59153 3.09748C7.69705 3.89753 7.89274 4.68308 8.17486 5.43914C8.28698 5.73741 8.31125 6.06157 8.24478 6.37321C8.17832 6.68485 8.02392 6.9709 7.79986 7.19748L6.74153 8.25581C7.92783 10.3421 9.65524 12.0695 11.7415 13.2558L12.7999 12.1975C13.0264 11.9734 13.3125 11.819 13.6241 11.7526C13.9358 11.6861 14.2599 11.7104 14.5582 11.8225C15.3143 12.1046 16.0998 12.3003 16.8999 12.4058C17.3047 12.4629 17.6744 12.6668 17.9386 12.9787C18.2029 13.2906 18.3433 13.6888 18.3332 14.0975Z"
                        stroke="#3D84DA"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Inbound
                  </p>
                  <p className="datetime">
                    <span>Date & time</span>
                    {formatDateTime(callHistory?.start_time)}
                  </p>
                </div>
                <div className="o-general-dashboard__filteritemdetais">
                  <div className="o-general-dashboard__filteritembox">
                    <label>Contact number</label>
                    <p>{callHistory?.to_number}</p>
                  </div>
                  <div className="o-general-dashboard__filteritembox">
                    <label>Agent Name</label>
                    <p>{callHistory?.agent}</p>
                  </div>
                  <div className="o-general-dashboard__filteritembox">
                    <label>Agent number</label>
                    <p>{callHistory?.from_number}</p>
                  </div>
                  <div className="o-general-dashboard__filteritembox">
                    <label>Call duration</label>
                    <p>{formatSeconds(callHistory?.total_time)}</p>
                  </div>
                  <div className="o-general-dashboard__filteritembox">
                    <label>Call Charges</label>
                    <p>${callHistory?.charges}</p>
                  </div>
                </div>
                <div className="o-general-dashboard__filteritembtn">
                  {callHistory.recording_url && (
                    <button
                      className="o-general-dashboard__buttonsfill"
                      onClick={() =>
                        handlePlayPause(
                          callHistory.recording_url,
                          callHistory.id
                        )
                      }
                    >
                      {playingStates[callHistory.id]
                        ? "PAUSE AUDIO"
                        : "LISTEN AUDIO TRANSCRIPT"}
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d={
                            playingStates[callHistory.id]
                              ? "M8 2.5h-3v15h3v-15zm7 0h-3v15h3v-15z"
                              : "M4.16699 2.5L15.8337 10L4.16699 17.5V2.5Z"
                          }
                          stroke="white"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                  {/* <audio
                    className="js-voice-track"
                    src="https://cdn.rawgit.com/caseyfw/slack-sounds/master/sounds/yodel.mp3"
                    preload="metadata"
                    type="audio/mpeg"
                  />
                  <Link
                    to="#"
                    state={{}}
                    className="o-general-dashboard__buttonsfill"
                  >
                    LISTEN AUDIO TRANSCRIPT
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M4.16699 2.5L15.8337 10L4.16699 17.5V2.5Z"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link> */}
                  {callHistory?.call_info && (
                    <Link
                      to={`/${
                        user.role === "Admin" ? "admin" : "customer"
                      }/call/call-details/audio-transcript`}
                      state={{
                        call_info: callHistory?.call_info,
                        recording_url: callHistory?.recording_url,
                      }}
                      className="o-general-dashboard__buttonsfill"
                    >
                      Export transcript
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
                        />
                        <path
                          d="M7 10L12 15L17 10"
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 15V3"
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="my-3">
            {!isPending && !isError && data?.data?.length > 0 && (
              <Pagination
                currentPage={searchParams.page}
                totalPages={Math.ceil(data?.count / DEFAULT_PAGE_SIZE)}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCallsDashboard;
