"use client";

import { useEffect, useState } from "react";
import { closestCorners, DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { CamBoard } from "@/components/CamBoard";
import { DropZone } from "@/components/Dropzone";
import { CameraItem } from "@/components/CameraItem";
import { VideoArea } from "@/components/VideoArea";
import { formattIdCam } from "@/services/useFormatter";
import { useActiveCamera } from "@/contexts/CamContext";
import socket from "@/libs/socket"; // já está configurado no seu projeto
import { Camera } from "@/types/Camera";

const Page = () => {
  const [cams, setCams] = useState<Camera[]>([]);
  const [selectedCams, setSelectedCams] = useState<Camera[]>([]);
  const [activeCamera, setActiveDragCamera] = useState<Camera | undefined>();
  const { setActiveCamera } = useActiveCamera();

  useEffect(() => {
    socket.on("init-cameras", (data: { cams: Camera[]; selectedCams: Camera[] }) => {
      setCams(data.cams);
      setSelectedCams(data.selectedCams);
    });

    socket.on("update-cameras", (data: { cams: Camera[]; selectedCams: Camera[] }) => {
      setCams(data.cams);
      setSelectedCams(data.selectedCams);
    });

    return () => {
      socket.off("init-cameras");
      socket.off("update-cameras");
    };
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragCamera(undefined);
    
  
    if (!active || !over) return;
    if (active.id === over.id) return; // Se arrastou para o mesmo lugar, ignora
  
    const draggedCamera = cams.find((cam) => String(cam.id) === active.id) 
                        || selectedCams.find((cam) => String(cam.id) === active.id);
  
    if (!draggedCamera) return;
  
    let newCams = [...cams];
    let newSelectedCams = [...selectedCams];
  
    if (over.id === "dropzone") {
      // Arrastando para a zona de drop
      newCams = newCams.filter((cam) => cam.id !== draggedCamera.id);
      if (!newSelectedCams.find((cam) => cam.id === draggedCamera.id)) {
        newSelectedCams.push(draggedCamera);
      }
    } else {
      // Arrastando para a board (CamBoard)
      newSelectedCams = newSelectedCams.filter((cam) => cam.id !== draggedCamera.id);
      if (!newCams.find((cam) => cam.id === draggedCamera.id)) {
        newCams.push(draggedCamera);
      }
    }
  
    setCams(newCams);
    setSelectedCams(newSelectedCams);
  
    // Emite para todo mundo
    socket.emit("move-camera", { cams: newCams, selectedCams: newSelectedCams });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active) return;

    const camera = [...cams, ...selectedCams].find((cam) => String(cam.id) === active.id);
    setActiveDragCamera(camera);
  };

  return (
    <main className="flex flex-col lg:flex-row items-center gap-6 w-screen mt-3 px-20">
      <VideoArea />

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="grid grid-cols-2 gap-4 mb-12 w-full">
          <DropZone selectedCams={selectedCams} setSelectedCams={setSelectedCams} setCams={setCams} cams={cams} />
          <CamBoard cams={cams} />
        </div>

        <DragOverlay>
          {activeCamera && (
            <CameraItem data={activeCamera} setPlay={setActiveCamera}>
              <div className="bg-[#07A6FF] px-8 font-bold py-2 rounded-lg text-white">
                {formattIdCam(activeCamera.id)}
              </div>
            </CameraItem>
          )}
        </DragOverlay>
      </DndContext>
    </main>
  );
};

export default Page;
