import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { ProfileSkeleton } from "../../components/Skeleton";
import ErrorState from "../../components/ErrorState";
import ReelCard from "../../components/ReelCard";
import profileimg from '../../assets/user-avatar.png'

const Store = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [modalMuted, setModalMuted] = useState(true);
  const [activeModalIndex, setActiveModalIndex] = useState(0);

  const reelRefs = useRef([]);
  const modalContainerRef = useRef(null);

  const fetchStore = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await axios.get(`${API_BASE_URL}/api/food-partner/${id}`, {
        withCredentials: true,
      });
      const partner = response.data.foodPartner || {};
      setProfile(partner);
      setVideos(partner.foodItems || []);
    } catch (err) {
      console.error("Failed to fetch store:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  useEffect(() => {
    if (selectedIndex !== null) {
      setActiveModalIndex(selectedIndex);
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex !== null && reelRefs.current[selectedIndex]) {
      setTimeout(() => {
        reelRefs.current[selectedIndex]?.scrollIntoView({
          behavior: "instant",
          block: "start",
        });
      }, 50);
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null || videos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(idx)) {
              setActiveModalIndex(idx);
            }
          }
        });
      },
      {
        root: modalContainerRef.current,
        threshold: 0.6,
      }
    );

    const currentRefs = reelRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [selectedIndex, videos]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <ErrorState
          title="Store Unavailable"
          message="Could not load food partner store details. Please try again."
          onRetry={fetchStore}
        />
      </div>
    );
  }

  return (
    <>
      <main className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-shrink-0 relative group">
            <img
              className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
              src={profileimg}
              alt={profile?.name || "Food Store"}
              loading="lazy"
            />
          </div>

          <div className="flex-1 w-full text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
              {profile?.name}
            </h1>

            <p className="text-gray-600 mb-6 text-sm md:text-base flex items-center justify-center md:justify-start gap-1.5">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {profile?.address}
            </p>

            <div className="flex justify-center md:justify-start gap-10 mb-6">
              <div className="text-center md:text-left">
                <span className="font-bold text-xl text-gray-900">{videos.length}</span>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Meals</p>
              </div>

              <div className="text-center md:text-left">
                <span className="font-bold text-xl text-gray-900">1K+</span>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Customers Served</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/home')}
              className="rounded-full cursor-pointer bg-gray-900 hover:bg-black text-white font-semibold px-6 py-2.5 text-sm shadow-md active-tactile transition-all inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Feed
            </button>
          </div>
        </section>

        <div className="border-t border-gray-200 my-10"></div>

        <div className="flex items-center justify-between mb-6">
          <span className="uppercase tracking-widest text-xs font-bold text-gray-500">
            Store Meals ({videos.length})
          </span>
        </div>

        {/* Video Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {videos.map((video, index) => (
            <div
              key={video._id || index}
              className="relative aspect-square bg-gray-900 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => setSelectedIndex(index)}
              role="button"
              tabIndex={0}
              aria-label={`View reel for ${video.name || 'food item'}`}
            >
              <video
                src={video.video}
                muted
                preload="metadata"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="p-3 rounded-full bg-white/30 backdrop-blur-md text-white active-tactile">
                  <svg className="w-8 h-8 fill-current translate-x-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {video.name && (
                <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-xs font-semibold truncate">
                  {video.name}
                </div>
              )}
            </div>
          ))}
        </section>
      </main>

      {/* Reels Full Screen Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black z-50 overflow-hidden">
          <button
            onClick={() => setSelectedIndex(null)}
            className="fixed top-5 right-5 z-50 text-white text-xl p-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md active-tactile transition-all cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>

          <div
            ref={modalContainerRef}
            className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
          >
            {videos.map((video, index) => (
              <div
                key={video._id || index}
                data-index={index}
                ref={(el) => (reelRefs.current[index] = el)}
                className="h-screen w-full snap-start"
              >
                <ReelCard
                  reel={video}
                  isActive={index === activeModalIndex}
                  isMuted={modalMuted}
                  onToggleMute={() => setModalMuted((prev) => !prev)}
                  onVisitStore={() => setSelectedIndex(null)}
                  onLogout={() => navigate('/')}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Store;