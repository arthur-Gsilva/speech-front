"use client";

import { CameraItem } from "@/components/CameraItem";
import { cameras } from "@/data/cameras";
import useSpeechRecognition from "@/libs/speech/useVoiceRecogninition";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { CiSearch } from "react-icons/ci";

const Page = () => {
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (currentVideo && videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(currentVideo);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.muted = true; 
          video.play().catch((error) => console.error("Erro ao iniciar vídeo:", error));
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = currentVideo;
        video.muted = true;
        video.play().catch((error) => console.error("Erro ao iniciar vídeo:", error));
      }
    }
  }, [currentVideo]);

  useSpeechRecognition((url) => {
    setCurrentVideo(url);
  });

  return (
    <main className="flex items-center w-screen min-h-screen px-20 gap-6">
      <div className="w-[65%] h-full ">
        
        <video ref={videoRef} autoPlay className="h-[500px] w-full border border-black" />
        <button>Gravar</button>
      </div>

      <div className="w-[35%] h-full mb-12">
        <button>Mapa</button>
        <div className="bg-amber-400 p-2 px-4 pt-4 max-h-[500px] overflow-hidden overflow-y-auto">
          <div className="flex items-center bg-amber-100 rounded-md p-1 pl-3 mb-4">
            <input type="text" className="outline-0 border-none flex-1" />
            <CiSearch />
          </div>

          <div className="flex flex-col gap-6 ">
            {cameras.map((item) => (
              <CameraItem key={item.id} data={item} setPlay={setCurrentVideo}/>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
