import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const ReelCard = ({
  reel,
  isActive,
  isMuted,
  onToggleMute,
  onVisitStore,
  onLogout,
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showMuteFeedback, setShowMuteFeedback] = useState(false);
  const [hearts, setHearts] = useState([]);
  const lastTapRef = useRef(0);

  // Handle Play/Pause when isActive changes via IntersectionObserver
  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay might be blocked if unmuted, force muted fallback
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  // Sync volume/mute prop
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Progress bar updater
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  // Mute / Unmute & Double tap like handler
  const handleVideoClick = useCallback(
    (e) => {
      const now = Date.now();
      const DOUBLE_TAP_DELAY = 280;

      if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
        // Double Tap detected -> trigger Heart Pop
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newHeart = {
          id: Date.now() + Math.random(),
          x: x > 0 ? x : rect.width / 2,
          y: y > 0 ? y : rect.height / 2,
        };

        setHearts((prev) => [...prev, newHeart]);

        // Remove heart after animation finishes
        setTimeout(() => {
          setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
        }, 850);
      } else {
        // Single tap -> toggle Mute with feedback icon
        onToggleMute();
        setShowMuteFeedback(true);
        setTimeout(() => setShowMuteFeedback(false), 700);
      }

      lastTapRef.current = now;
    },
    [onToggleMute]
  );

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-black snap-start overflow-hidden select-none">
      {/* Video Container */}
      <div
        className="relative h-full w-full max-w-[440px] flex items-center justify-center cursor-pointer"
        onClick={handleVideoClick}
      >
        <video
          ref={videoRef}
          src={reel.video}
          playsInline
          loop
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          className="h-full w-full object-cover"
          aria-label={reel.description || reel.name || 'Food reel video'}
        />

        {/* Mute Icon Feedback Animation Overlay */}
        {showMuteFeedback && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="p-4 rounded-full bg-black/60 text-white backdrop-blur-md animate-icon-pulse">
              {isMuted ? (
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </div>
          </div>
        )}

        {/* Double-Tap Heart Pop FX */}
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute pointer-events-none z-40 animate-heart-pop text-red-500 drop-shadow-lg"
            style={{
              left: `${heart.x}px`,
              top: `${heart.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <svg className="w-20 h-20 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        ))}

        {/* Overlay Info & Actions */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 text-white z-20">
          {reel.name && (
            <h2 className="text-lg font-bold text-orange-400 mb-1 tracking-wide">{reel.name}</h2>
          )}
          <p className="mb-4 text-sm md:text-base leading-relaxed text-gray-100 line-clamp-3">
            {reel.description || 'Delicious meal preview'}
          </p>

          <div className="flex items-center justify-between">
            {reel.foodPartner && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onVisitStore(reel.foodPartner);
                }}
                className="rounded-full bg-white/90 hover:bg-white text-black font-semibold px-5 py-2.5 text-sm shadow-lg active-tactile transition-all cursor-pointer flex items-center gap-2"
                aria-label="Visit Food Partner Store"
              >
                <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Visit Store
              </button>
            )}

            {/* Mute Indicator Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMute();
              }}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm active-tactile transition-all cursor-pointer"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
          <div
            className="h-full bg-red-600 transition-all duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReelCard;
