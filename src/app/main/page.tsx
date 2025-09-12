"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from "@dnd-kit/core";
import { CamBoard } from "@/components/CamBoard";
import { DropZone } from "@/components/Dropzone";
import { CameraItem } from "@/components/CameraItem";
import { VideoArea } from "@/components/VideoArea";
import { formattIdCam } from "@/services/useFormatter";
import { useActiveCamera } from "@/contexts/CamContext";
import { useCamerasSocket } from "@/hooks/useCameraSocket";
import { useUserAuth } from "@/hooks/useUserAuth";
import { Camera } from "@/types/Camera";
import { Header } from "@/components/Header";
import { cameras } from "@/data/cameras";
import { VideoPreview } from "@/components/VideoPreview";

const Page = () => {
    const { availableCams, selectedCams, updateSelectedCams } = useCamerasSocket();
    const [activeCamera, setActiveDragCamera] = useState<Camera | undefined>();
    const { user } = useUserAuth();
    const { setActiveCamera } = useActiveCamera();


    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragCamera(undefined);

        if (!active || !over || active.id === over.id) return;

        const dragged = [...availableCams, ...selectedCams].find(cam => String(cam.id) === active.id);
        if (!dragged) return;

        let updated = [...selectedCams];

        if (over.id === "dropzone") {
            if (!updated.find((cam) => cam.id === dragged.id)) updated.push(dragged);
        } else {
            updated = updated.filter((cam) => cam.id !== dragged.id);
        }

        updateSelectedCams(updated);
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        if (!active) return;

        const camera = [...cameras, ...selectedCams].find((cam) => String(cam.id) === active.id);
        setActiveDragCamera(camera);
    };

    return (
        <>
            <Header />

            <main className="flex flex-col lg:flex-row items-center gap-6 max-w-screen mt-3 px-20 ">
                 <VideoArea />

                <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                    <div className="grid grid-cols-2 gap-4 mb-12 w-full relative">
                        <DropZone
                            selectedCams={selectedCams}
                            updateSelectedCams={updateSelectedCams}
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
            </main>
        </>
    );
};

export default Page;
