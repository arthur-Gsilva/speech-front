"use client";

import { cameras } from "@/data/cameras";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Camera } from "@/types/Camera";
import { closestCorners, DndContext, DragEndEvent } from "@dnd-kit/core";
import { CamBoard } from "@/components/CamBoard";
import { DropZone } from "@/components/Dropzone";
import useSpeechRecognition from "@/libs/speech/useVoiceRecogninition";

const Page = () => {
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cams, setCams] = useState<Camera[]>(cameras);
  const [selectedCams, setSelectedCams] = useState<Camera[]>([]);
  const [isDragging, setIsDragging] = useState(false); 

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

  const handleCameraDetected = (url: string | null) => {
    setCurrentVideo(url);
  };

  const { isListening } = useSpeechRecognition(recording, handleCameraDetected);
  if(isListening === false){
    console.log('')
  }


  // Função para lidar com o fim do arrasto
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over) return;

    const draggedCamera = cams.find((cam) => String(cam.id) === active.id);

    if (!draggedCamera) return;

    
    if (over.id === "dropzone") {
      setCams((prev) => prev.filter((cam) => cam.id !== draggedCamera.id));
      setSelectedCams((prev) => [...prev, draggedCamera]);
    }

    console.log(isDragging)
    
    setIsDragging(false); 
  };


  return (
    <main className="flex items-center w-screen min-h-screen px-20 gap-6">
      <div className="w-full h-full flex-1">
        <video ref={videoRef} autoPlay className="h-[500px] w-full border border-black" />
        <button
          className="bg-red-500 p-2 text-white rounded-md cursor-pointer"
          style={{ backgroundColor: recording ? "gray" : "red" }}
          onClick={() => setRecording(!recording)}
        >
          {!recording ? <>Gravar</> : <>Parar</>}
        </button>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-2 gap-4 mb-12">

          
          <DropZone 
            selectedCams={selectedCams} 
            setCurrentVideo={setCurrentVideo} 
            currentVideo={currentVideo}
            setSelectedCams={setSelectedCams}
            setCams={setCams}
            cams={cams}
          />

          
          <CamBoard
            cams={cams}
            setCurrentVideo={setCurrentVideo}
            
          />
        </div>
      </DndContext>
    </main>
  );
};

export default Page;
