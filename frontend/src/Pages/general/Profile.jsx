import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { ProfileSkeleton } from '../../components/Skeleton';
import ErrorState from '../../components/ErrorState';
import ReelCard from '../../components/ReelCard';
import profileimg from '../../assets/user-avatar.png'

const Profile = () => {
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

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await axios.get(`${API_BASE_URL}/api/food-partner/home`, {
        withCredentials: true,
      });
      const partner = response.data.foodPartner || {};
      setProfile(partner);
      setVideos(partner.foodItems || []);
    } catch (err) {
      console.error("Failed to fetch food-partner profile:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (selectedIndex !== null) {
      setActiveModalIndex(selectedIndex);
    }
  }, [selectedIndex]);

  // Scroll to selected reel when modal opens
  useEffect(() => {
    if (selectedIndex !== null && reelRefs.current[selectedIndex]) {
      setTimeout(() => {
        reelRefs.current[selectedIndex]?.scrollIntoView({
          behavior: 'instant',
          block: 'start',
        });
      }, 50);
    }
  }, [selectedIndex]);

  // IntersectionObserver for full-screen modal reels
  useEffect(() => {
    if (selectedIndex === null || videos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'));
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

  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/api/auth/food-partner/logout`, {
        withCredentials: true,
      });
      window.location.replace('/');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <ErrorState
          title="Failed to load profile"
          message="We could not fetch your partner account details. Please check your connection."
          onRetry={fetchProfile}
        />
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      {/* Profile Header */}
      <section className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Profile Avatar */}
        <div className="flex-shrink-0 relative group">
          <img
            className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
            src={profileimg}
            alt={profile?.name || "Food Partner Avatar"}
            loading="lazy"
          />
        </div>

        {/* Profile Details */}
        <div className="flex-1 w-full text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
            {profile?.name || "Partner Name"}
          </h1>

          <p className="text-gray-600 mb-6 text-sm md:text-base flex items-center justify-center md:justify-start gap-1.5">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {profile?.address || "Location Address"}
          </p>

          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-10 mb-8">
            <div className="text-center md:text-left">
              <span className="font-bold text-xl text-gray-900">
                {videos.length}
              </span>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                Meals
              </p>
            </div>

            <div className="text-center md:text-left">
              <span className="font-bold text-xl text-gray-900">
                1K+
              </span>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">
                Customers
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={() => navigate('/create-food')}
              className="rounded-full cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 text-sm shadow-md active-tactile transition-all flex items-center gap-2"
              aria-label="Upload new food reel"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Food Item
            </button>

            <button
              onClick={handleLogout}
              className="rounded-full cursor-pointer border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold px-6 py-3 text-sm active-tactile transition-all flex items-center gap-2"
              aria-label="Logout partner account"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200 my-10" />

      {/* Gallery Heading */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="uppercase tracking-widest text-xs font-bold text-gray-500">
          Uploaded Food Reels ({videos.length})
        </h2>
      </div>

      {/* Video Grid */}
      {videos.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600 font-semibold">No food reels added yet</p>
          <p className="text-gray-400 text-sm mt-1 mb-4">Upload your first food video to start showcasing meals</p>
          <button
            onClick={() => navigate('/create-food')}
            className="px-5 py-2.5 rounded-full bg-red-600 text-white font-semibold text-xs active-tactile transition-all"
          >
            Create Food Reel
          </button>
        </div>
      ) : (
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
              
              {/* Play Overlay Icon */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="p-3 rounded-full bg-white/30 backdrop-blur-md text-white active-tactile">
                  <svg className="w-8 h-8 fill-current translate-x-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Title Tag */}
              {video.name && (
                <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-xs font-semibold truncate">
                  {video.name}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Full-Screen Reels Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black z-50 overflow-hidden">
          {/* Close Button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="fixed top-5 right-5 z-50 text-white text-xl p-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md active-tactile transition-all cursor-pointer"
            aria-label="Close modal viewer"
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
                  onLogout={handleLogout}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;