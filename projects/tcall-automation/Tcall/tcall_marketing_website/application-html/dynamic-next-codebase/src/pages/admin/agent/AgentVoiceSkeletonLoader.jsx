const AgentVoiceSkeletonLoader = () => (
  <>
    {[1, 2, 3, 4].map((item) => (
      <li key={item} className="agent-wrapper__voiceitem animate-pulse">
        <div className="agent-wrapper__voiceitems">
          <div className="agent-wrapper__itemsinside chkbody">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="text-part flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="music-span">
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </li>
    ))}
  </>
);

export default AgentVoiceSkeletonLoader;
