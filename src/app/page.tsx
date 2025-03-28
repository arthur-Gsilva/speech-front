"use client";

import { cameras } from "@/data/cameras";
import useSpeechRecognition from "@/libs/speech/useVoiceRecogninition";
import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { Camera } from "@/types/Camera";
import { closestCorners, DndContext, DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { CamBoard } from "@/components/CamBoard";
import { DropZone } from "@/components/Dropzone";

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

  // Função para detectar o início do arrasto
  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true); // Marca que está arrastando
  };

  // Função para lidar com o fim do arrasto
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over) return;

    const draggedCamera = cams.find((cam) => String(cam.id) === active.id);

    if (!draggedCamera) return;

    // Se o item foi solto na dropzone, remove do CamBoard e adiciona à nova área
    if (over.id === "dropzone") {
      setCams((prev) => prev.filter((cam) => cam.id !== draggedCamera.id));
      setSelectedCams((prev) => [...prev, draggedCamera]);
    }

    setIsDragging(false); // Marca que o arrasto terminou
  };

  const handleClick = useCallback((cameraUrl: string) => {
    // Só chama a função de clique se não estiver arrastando
    if (!isDragging) {
      setCurrentVideo(cameraUrl);
    }
  }, [isDragging]);

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
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-2 gap-4 mb-12">

          {/* Área de destino */}
          <DropZone 
            selectedCams={selectedCams} 
            setCurrentVideo={setCurrentVideo} 
            currentVideo={currentVideo}
            setSelectedCams={setSelectedCams}
            setCams={setCams}
            cams={cams}
          />

          {/* Lista de câmeras */}
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
