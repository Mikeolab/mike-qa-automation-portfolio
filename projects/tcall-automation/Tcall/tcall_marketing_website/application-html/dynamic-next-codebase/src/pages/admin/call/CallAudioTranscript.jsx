import React, { useEffect, useState } from "react";

import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import BackButton from "../../../components/shared/BackButton";
import DownloadIcon from "../../../components/icons/DownloadIcon";
import UserImage from "../../../assets/images/user.png";

export default function CallAudioTranscript() {
  const location = useLocation();
  const [metadataLoaded, setMetadataLoaded] = useState(false);

  const [data, setData] = useState({
    total_time: 0,
    recording_url: "",
    call_info: "",
  });

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      call_info: location.state.call_info,
      recording_url: location.state.recording_url,
      total_time: location.state.total_time,
    }));
  }, [location.state]);

  const [audio, setAudio] = useState(new Audio(data.recording_url));

  useEffect(() => {
    setAudio(new Audio(data.recording_url));
    setMetadataLoaded(false); // Reset metadata loaded state when audio changes
  }, [data]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [duration, setDuration] = useState(0);

  const conversations = data.call_info
    ? data.call_info
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const [speaker, ...message] = line.split(": ");
          return {
            speaker: speaker.trim(),
            message: message.join(": ").trim(),
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        })
    : [];

  useEffect(() => {
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setMetadataLoaded(true);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
      audio.currentTime = 0;
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause(); // Stop audio on cleanup
      audio.currentTime = 0; // Reset audio position
      setIsPlaying(false); // Reset playing state
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audio]);

  const handleSeek = (e) => {
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * audio.duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(clickPosition * 100);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const exportToExcel = () => {
    const exportData = conversations.map((conv) => ({
      Speaker: conv.speaker,
      Message: conv.message,
      Time: conv.time,
      "Recording URL": data.recording_url,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Conversation");
    XLSX.writeFile(wb, "call_transcript.xlsx");
  };

  const highlightText = (text, search) => {
    if (!search) return text;

    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: "yellow", color: "black" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="o-dasboard__rightbar o-dasboard__rightbar--doctordash">
      <BackButton />
      <div className="o-dasboard__rightbody flex-body flex-div-start">
        <div className="o-general-dashboard__audiotranscriptouter">
          <div className="o-general-dashboard__audiotranscriptinner">
            <h2 className="o-general-dashboard__innerheading">
              Audio Transcript
            </h2>
            <div className="o-general-dashboard__transcripthader">
              <input
                type="text"
                placeholder="Search transcript"
                className="search-input text-white"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {conversations.length > 0 && (
                <button onClick={exportToExcel} className="extbtn">
                  export
                  <DownloadIcon />
                </button>
              )}
            </div>
            <ul className="o-general-dashboard__transchatul">
              {conversations.length > 0 ? (
                conversations.map((conv, index) => (
                  <li key={index} className="o-general-dashboard__transchatli">
                    <div className="o-general-dashboard__transchatlihead">
                      <p className="profile">
                        <span className="image">
                          {conv.speaker === "User" && (
                            <img src={UserImage} alt="chat user" />
                          )}
                        </span>
                        {conv.speaker}
                      </p>
                      <span className="time">{conv.time}</span>
                    </div>
                    <p className="o-general-dashboard__trantext">
                      {highlightText(conv.message, searchText)}
                    </p>
                  </li>
                ))
              ) : (
                <li className="o-general-dashboard__transchatli">
                  <p className="o-general-dashboard__trantext text-center">
                    No Conversation Available
                  </p>
                </li>
              )}
            </ul>

            <div className="o-general-dashboard__audioplayer">
              <div className="audio-player">
                {data?.recording_url && (
                  <div className="timeline" onClick={handleSeek}>
                    <div
                      className="progress"
                      style={{ width: `${progress}%` }}
                    ></div>
                    <div
                      className="progress-handle"
                      style={{ left: `${progress}%` }}
                    ></div>
                  </div>
                )}
                {!data?.recording_url ? (
                  <div>No Audio Available</div>
                ) : !metadataLoaded ? (
                  <div>Loading Audio...</div>
                ) : (
                  <div className="controls">
                    <div className="part">
                      <div className="name">LISTEN</div>
                      <div className="play-container">
                        <div
                          className={`toggle-play ${
                            isPlaying ? "pause" : "play"
                          }`}
                          onClick={togglePlay}
                        ></div>
                      </div>
                    </div>
                    <div className="time">
                      <div className="current">{formatTime(currentTime)}</div>
                      <div className="divider">/</div>
                      <div className="length">{formatTime(duration)}</div>
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
