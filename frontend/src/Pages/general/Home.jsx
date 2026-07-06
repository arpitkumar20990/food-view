import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../../config'

export default function Home() {
  const [reels, setReels] = useState([]);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/food`, {
        withCredentials: true,
      })
      .then((response) => {
        setReels(response.data.foodItems);
      })
      .catch((err) => console.log(err));
  }, []);

  const videoRef = useRef(null);
  const touchStart = useRef(0);
  const lastScroll = useRef(0);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [current]);

  const nextReel = useCallback(() => {
    if (reels.length === 0) return;
    setCurrent((prev) => (prev + 1) % reels.length);
  }, [reels.length]);

  const prevReel = useCallback(() => {
    if (reels.length === 0) return;
    setCurrent((prev) => (prev - 1 + reels.length) % reels.length);
  }, [reels.length]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setPlaying((prev) => !prev);
  }, [playing]);

  const handleWheel = useCallback((e) => {
    const now = Date.now();

    if (now - lastScroll.current < 400) return;

    lastScroll.current = now;

    if (e.deltaY > 0) nextReel();
    else prevReel();
  }, [nextReel, prevReel]);

  const handleTouchStart = useCallback((e) => {
    touchStart.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const end = e.changedTouches[0].clientY;

    const diff = touchStart.current - end;

    if (Math.abs(diff) < 60) return;

    diff > 0 ? nextReel() : prevReel();
  }, [nextReel, prevReel]);

  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === "ArrowDown") nextReel();
      if (e.key === "ArrowUp") prevReel();
    };

    window.addEventListener("keydown", keyHandler);

    return () => window.removeEventListener("keydown", keyHandler);
  }, [nextReel, prevReel]);

  const reel = reels[current];

  if (!reel) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div
      onClick={togglePlay}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black"
    >
      <button
            onClick={() => 
              axios.get(`${API_BASE_URL}/api/auth/user/logout`,{
                withCredentials : true
              }).then(()=>{
                  window.location.replace('/')
              }).catch((err)=>{
                console.log(err)
              })
            }
            className="fixed top-5 right-5 cursor-pointer z-50 text-white text-2xl font-semibold bg-red-700 rounded-md p-[5px]"
          >
            Logout
          </button>
      <video
        key={reel.i_d}
        ref={videoRef}
        src={reel.video}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full max-w-[420px] object-cover"
      />
      

      <div className="absolute bottom-0 w-full max-w-[420px] bg-gradient-to-t from-black/75 to-transparent p-6 text-white">
        <p className="mb-[18px] text-base leading-6">
          {reel.description}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/food-partner/${reel.foodPartner}`)
          }}
          className="rounded-full bg-white px-6 py-3 font-semibold text-black active:scale-95"
        >
          Visit Store
        </button>
      </div>
    </div>
  );
}