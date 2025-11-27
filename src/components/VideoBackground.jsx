import { useState, useRef, useEffect } from 'react';
import './VideoBackground.css';

// Free robot/automation video URLs (Creative Commons / free to use)
const videoSources = {
  robots: 'https://assets.mixkit.co/videos/preview/mixkit-industrial-robot-arm-in-a-factory-42956-large.mp4',
  warehouse: 'https://assets.mixkit.co/videos/preview/mixkit-top-aerial-shot-of-seaport-702-large.mp4',
  tech: 'https://assets.mixkit.co/videos/preview/mixkit-data-center-servers-close-up-4692-large.mp4',
  drone: 'https://assets.mixkit.co/videos/preview/mixkit-drone-flying-over-a-green-field-50282-large.mp4',
};

const VideoBackground = ({ 
  videoKey = 'robots', 
  overlay = true, 
  overlayOpacity = 0.7,
  fallbackColor = '#0f1117'
}) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay might be blocked
        setHasError(true);
      });
    }
  }, []);

  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div className="video-background">
      {!hasError && (
        <video
          ref={videoRef}
          className={`video-bg ${isLoaded ? 'loaded' : ''}`}
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={handleLoadedData}
          onError={handleError}
        >
          <source src={videoSources[videoKey] || videoSources.robots} type="video/mp4" />
        </video>
      )}
      
      {overlay && (
        <div 
          className="video-overlay"
          style={{ 
            '--overlay-opacity': overlayOpacity,
            '--fallback-color': fallbackColor 
          }}
        />
      )}
      
      {/* Gradient fade at edges */}
      <div className="video-gradient-top" />
      <div className="video-gradient-bottom" />
    </div>
  );
};

export default VideoBackground;
