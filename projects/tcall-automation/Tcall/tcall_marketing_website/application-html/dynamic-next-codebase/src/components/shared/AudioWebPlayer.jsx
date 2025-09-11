import { useState, useRef } from "react";

import waveImage from "../../assets/images/wave-svg.svg";
import pauseVideoIcon from "../../assets/images/icons/pause-video.svg";
import playVideoIcon from "../../assets/images/icons/play-video.svg";

const AudioWavePlayer = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="music-span">
        <audio
          ref={audioRef}
          className="js-voice-track"
          src={audioSrc}
          preload="metadata"
          type="audio/mpeg"
          onEnded={handleAudioEnd}
        />
        <span className={`wave-wrap ${isPlaying ? "playing" : ""}`}>
          <img src={waveImage} className="js-wave" alt="wave" />
        </span>
      </div>
      <button
        onClick={togglePlay}
        className=" p-2 cursor-pointer bg-transparent border-0"
        type="button"
      >
        <img
          src={isPlaying ? playVideoIcon : pauseVideoIcon}
          className={`w-6 h-6 ${isPlaying ? "play" : "pause"}`}
          alt={isPlaying ? "play video" : "pause video"}
        />
      </button>
    </div>
  );
};

export default AudioWavePlayer;
