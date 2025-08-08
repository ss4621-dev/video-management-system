import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ streamId }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // In a real application, this would connect to a WebSocket or 
    // use a video streaming protocol to show the actual video
    // For now, we'll simulate a video player
    
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.innerHTML = `
          <div style="
            background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 16px;
            text-align: center;
            padding: 20px;
          ">
            <div>
              <div style="font-size: 48px; margin-bottom: 10px;">📹</div>
              <h4>Stream #{streamId} Preview</h4>
              <p>Live video would appear here</p>
              <p className="small">RTSP/WebRTC streaming would be implemented in production</p>
            </div>
          </div>
        `;
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [streamId]);

  return (
    <div 
      ref={videoRef}
      style={{
        width: '100%',
        aspectRatio: '16/9',
        backgroundColor: '#000',
        borderRadius: '4px',
        overflow: 'hidden'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#666'
      }}>
        Loading stream...
      </div>
    </div>
  );
};

export default VideoPlayer;