import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import ReelCard from "../../components/ReelCard";
import { ReelFeedSkeleton } from "../../components/Skeleton";
import ErrorState from "../../components/ErrorState";

export default function Home() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const videoCache = useRef(new Map()); // In-memory cache for watched/loaded video metadata
  const navigate = useNavigate();

  const fetchReels = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await axios.get(`${API_BASE_URL}/api/food`, {
        withCredentials: true,
      });
      const items = response.data.foodItems || [];
      setReels(items);
      
      // Seed initial item into cache
      items.forEach((item) => {
        if (item._id && item.video) {
          videoCache.current.set(item._id, item.video);
        }
      });
    } catch (err) {
      console.error("Failed to fetch food reels:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  // Preload Next 1-2 Videos in background
  useEffect(() => {
    if (reels.length === 0) return;

    const indicesToPreload = [activeIndex + 1, activeIndex + 2];
    indicesToPreload.forEach((idx) => {
      if (idx < reels.length) {
        const item = reels[idx];
        if (item && item.video && !videoCache.current.has(`preloaded_${item._id}`)) {
          const videoElement = document.createElement("video");
          videoElement.src = item.video;
          videoElement.preload = "auto";
          videoCache.current.set(`preloaded_${item._id}`, true);
        }
      }
    });
  }, [activeIndex, reels]);

  // IntersectionObserver to observe which reel card is visible in viewport
  useEffect(() => {
    if (loading || error || reels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index)) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6, // >= 60% in viewport
      }
    );

    const currentRefs = itemRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [loading, error, reels]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (reels.length === 0) return;

      if (e.key === "ArrowDown" && activeIndex < reels.length - 1) {
        e.preventDefault();
        const nextIdx = activeIndex + 1;
        itemRefs.current[nextIdx]?.scrollIntoView({ behavior: "smooth" });
      } else if (e.key === "ArrowUp" && activeIndex > 0) {
        e.preventDefault();
        const prevIdx = activeIndex - 1;
        itemRefs.current[prevIdx]?.scrollIntoView({ behavior: "smooth" });
      } else if (e.key === "m" || e.key === "M") {
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, reels.length]);

  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/api/auth/user/logout`, {
        withCredentials: true,
      });
      window.location.replace("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleVisitStore = (foodPartnerId) => {
    navigate(`/food-partner/${foodPartnerId}`);
  };

  if (loading) {
    return <ReelFeedSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <ErrorState
          title="Could not load reels"
          message="Unable to fetch food videos right now. Please check your network connection."
          onRetry={fetchReels}
          darkMode={true}
        />
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <h2 className="text-2xl font-bold mb-2">No Reels Available</h2>
        <p className="text-gray-400 max-w-sm mb-6">There are no food videos available at the moment. Check back soon!</p>
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 rounded-full bg-red-600 text-white font-semibold text-sm active-tactile transition-all"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden select-none">
      {/* Fixed Header Logout button */}
      <button
        onClick={handleLogout}
        className="fixed top-5 right-5 z-50 px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white text-xs md:text-sm font-semibold rounded-full shadow-lg backdrop-blur-md active-tactile transition-all cursor-pointer flex items-center gap-1.5"
        aria-label="Logout user"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>

      {/* Snap Scroll Container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth"
      >
        {reels.map((reel, index) => (
          <div
            key={reel._id || index}
            data-index={index}
            ref={(el) => (itemRefs.current[index] = el)}
            className="h-screen w-full snap-start"
          >
            <ReelCard
              reel={reel}
              isActive={index === activeIndex}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted((prev) => !prev)}
              onVisitStore={handleVisitStore}
              onLogout={handleLogout}
            />
          </div>
        ))}
      </div>
    </div>
  );
}