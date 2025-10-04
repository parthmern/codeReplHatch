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
        className="absolute -top-34 left-0 w-full object-cover"
      >
        <source src={vid} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay content */}
      <div className="relative z-10 flex h-full items-center justify-end pr-[20%]">
        <div className="text-white text-4xl flex flex-col items-center justify-center">
          <p>
            Build <span className="pixelFont">Software</span> like
          </p>
          <p>never before</p>
        </div>
      </div>
    </div>
  );
}
