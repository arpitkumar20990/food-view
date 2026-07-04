import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from '../../config'

const Store = () => {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const reelRefs = useRef([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/food-partner/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setProfile(response.data.foodPartner);
        setVideos(response.data.foodPartner.foodItems);
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    if (selectedIndex !== null && reelRefs.current[selectedIndex]) {
      reelRefs.current[selectedIndex].scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    }
  }, [selectedIndex]);

  return (
    <>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-shrink-0">
            <img
              className="w-36 h-36 md:w-44 md:h-44 rounded-full border-2 border-gray-300 object-cover"
              src="https://imgs.search.brave.com/VQuvaHNiCs5JXdTSVp_WL0g8U8XQ1v_6U5IQQa5l_SU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aWNvbnNjb3V0LmNv/bS9pY29uL2ZyZWUv/cG5nLTI1Ni9mcmVl/LXByb2ZpbGUtaWNv/bi1zdmctZG93bmxv/YWQtcG5nLTc1MTMw/OTcucG5nP2Y9d2Vi/cCZ3PTEyOA"
              alt="Profile"
            />
          </div>

          <div className="flex-1 w-full">
            <h1 className="text-3xl font-light mb-2">{profile?.name}</h1>

            <p className="text-gray-600 mb-6">{profile?.address}</p>

            <div className="flex gap-10 mb-6">
              <div>
                <span className="font-bold text-lg">{videos.length}</span>
                <p className="text-gray-500 text-sm">Meals</p>
              </div>

              <div>
                <span className="font-bold text-lg">1K</span>
                <p className="text-gray-500 text-sm">Customers</p>
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-gray-300 my-10"></div>

        <div className="flex justify-center mb-6">
          <span className="uppercase tracking-widest text-sm font-semibold text-gray-700">
            Videos
          </span>
        </div>

        {/* Video Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {videos.map((video, index) => (
            <div
              key={video._id}
              className="aspect-square bg-gray-100 overflow-hidden cursor-pointer"
              onClick={() => setSelectedIndex(index)}
            >
              <video
                src={video.video}
                muted
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </section>
      </main>

      {/* Reels Full Screen */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto snap-y snap-mandatory">
          {/* Close Button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="fixed top-5 right-5 z-50 text-white text-3xl font-bold"
          >
            ✕
          </button>

          {videos.map((video, index) => (
            <div
              key={video._id}
              ref={(el) => (reelRefs.current[index] = el)}
              className="h-screen w-full flex items-center justify-center snap-start"
            >
              <video
                src={video.video}
                controls
                autoPlay={index === selectedIndex}
                loop
                playsInline
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Store;