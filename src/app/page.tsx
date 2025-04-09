"use client";

import { cameras } from "@/data/cameras";
import { useState } from "react";
import { Camera } from "@/types/Camera";
import { closestCorners, DndContext, DragEndEvent, DragOverlay, DragStartEvent  } from "@dnd-kit/core";
import { CamBoard } from "@/components/CamBoard";
import { DropZone } from "@/components/Dropzone";
import { CameraItem } from "@/components/CameraItem";
import { VideoArea } from "@/components/VideoArea";
import { formattIdCam } from "@/services/useFormatter";

const Page = () => {
    const [currentVideo, setCurrentVideo] = useState<string | null>(null);
    const [cams, setCams] = useState<Camera[]>(cameras);
    const [selectedCams, setSelectedCams] = useState<Camera[]>([]);
    const [ , setIsDragging] = useState(false); 
    const [activeCamera, setActiveCamera] = useState<Camera | undefined>();


  // Função para lidar com o fim do arrasto
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveCamera(undefined)

        if (!active || !over) return;

        const draggedCamera = cams.find((cam) => String(cam.id) === active.id);

        if (!draggedCamera) return;


        if (over.id === "dropzone") {
            setCams((prev) => prev.filter((cam) => cam.id !== draggedCamera.id));
            setSelectedCams((prev) => [...prev, draggedCamera]);
        }
        setIsDragging(false); 
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        if (!active) return;

        const camera = cameras.find((cam) => String(cam.id) === active.id);
        setActiveCamera(camera);
    };

    return (
        <main className="flex items-center gap-6 w-screen mt-3 px-20">
            <VideoArea currentVideo={currentVideo} setCurrentVideo={setCurrentVideo}/>
            
            <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
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
                <DragOverlay>
                    {activeCamera ? <CameraItem data={activeCamera} setPlay={setCurrentVideo}>
                        <div className="bg-[#07A6FF] px-8 font-bold py-2 rounded-lg text-white">
                            {formattIdCam(activeCamera.id)}
                        </div>
                    </CameraItem> : null}
                </DragOverlay>
            </DndContext>
        </main>
    );
};

export default Page;