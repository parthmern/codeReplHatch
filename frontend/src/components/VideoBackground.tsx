import { useRef, useEffect } from "react";
import vid from "../assets/NeuralForge - Forge Your Creative Frontier.mp4";

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  return (
    <div className="relative h-screen w-full overflow-x-hidden">
      {/* Background video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute h-screen left-0 w-full object-cover"
      >
        <source src={vid} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay content */}
      <div className="relative z-10 flex h-full items-center justify-end pr-[20%]">
        <div className="text-white w-[300px] text-4xl flex flex-col items-center justify-center">
          <p>
            Build <span className="pixelFont">Software</span> like
          </p>
          <p>never before</p>
          <p className="ibmFont pt-10 text-[12px] uppercase  text-center ">
            Less bugs. More breakthroughs. Streamline development, cut the
            noise, and focus on what matters: building great software.
          </p>
          <button
            role="link"
            className="relative cursor-pointer pt-5 ibmFont uppercase text-[12px] after:absolute after:bottom-[-3px] after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            Explore Now
          </button>
        </div>
      </div>
    </div>
  );
}
