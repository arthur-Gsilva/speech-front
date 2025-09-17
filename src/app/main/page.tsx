"use client";

import { useEffect, useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from "@dnd-kit/core";
import { CamBoard } from "@/components/CamBoard";
import { DropZone } from "@/components/Dropzone";
import { CameraItem } from "@/components/CameraItem";
import { VideoArea } from "@/components/VideoArea";
import { formattIdCam } from "@/services/useFormatter";
import { useActiveCamera } from "@/contexts/CamContext";
import { Camera } from "@/types/Camera";
import { Header } from "@/components/Header";
import { cameras as initialCams } from "@/data/cameras";

const Page = () => {
  const [mounted, setMounted] = useState(false);
  const [availableCams, setAvailableCams] = useState<Camera[]>(initialCams);
  const [selectedCams, setSelectedCams] = useState<Camera[]>([]);
  const [activeCamera, setActiveDragCamera] = useState<Camera | undefined>();
  const { setActiveCamera } = useActiveCamera();

  useEffect(() => {
    setMounted(true); // agora estamos no cliente
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragCamera(undefined);
    if (!active || !over || active.id === over.id) return;

    const dragged = [...availableCams, ...selectedCams].find(cam => String(cam.id) === active.id);
    if (!dragged) return;

    let newAvailable = [...availableCams];
    let newSelected = [...selectedCams];

    if (over.id === "dropzone") {
      newAvailable = newAvailable.filter((cam) => cam.id !== dragged.id);
      if (!newSelected.find((cam) => cam.id === dragged.id)) newSelected.push(dragged);
    } else {
      newSelected = newSelected.filter((cam) => cam.id !== dragged.id);
      if (!newAvailable.find((cam) => cam.id === dragged.id)) newAvailable.push(dragged);
    }

    setAvailableCams(newAvailable);
    setSelectedCams(newSelected);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active) return;
    const camera = [...availableCams, ...selectedCams].find((cam) => String(cam.id) === active.id);
    setActiveDragCamera(camera);
  };

  return (
    <>
      <Header />

      <main className="flex flex-col lg:flex-row items-center gap-6 max-w-screen mt-3 px-20 ">
        <VideoArea />

        {/* Só monta o DnD depois do cliente */}
        {mounted ? (
          <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <div className="grid grid-cols-2 gap-4 mb-12 w-full relative">
              <DropZone
                selectedCams={selectedCams}
                setSelectedCams={setSelectedCams}
                setAvailableCams={setAvailableCams}
                availableCams={availableCams}
              />

              <CamBoard cams={availableCams} />
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
        ) : (
          // Opcional: placeholder estático para manter estrutura do DOM do SSR igual ao client
          <div className="grid grid-cols-2 gap-4 mb-12 w-full">
            <div className="h-96 bg-gray-50 rounded" />
            <div className="h-96 bg-gray-50 rounded" />
          </div>
        )}
      </main>
    </>
  );
};

export default Page;
