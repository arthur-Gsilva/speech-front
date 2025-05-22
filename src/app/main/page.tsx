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

const Page = () => {
    const { cams, selectedCams, updateCameras } = useCamerasSocket();
    const { user } = useUserAuth();
    const [activeCamera, setActiveDragCamera] = useState<Camera | undefined>();
    const { setActiveCamera } = useActiveCamera();

    const setCams = (newCams: Camera[]) => {
        updateCameras(newCams, selectedCams);
    };

    if (!user) return null;

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragCamera(undefined);

        if (!active || !over) return;
        if (active.id === over.id) return;

        const draggedCamera = [...cams, ...selectedCams].find((cam) => String(cam.id) === active.id);
        if (!draggedCamera) return;

        let newCams = [...cams];
        let newSelectedCams = [...selectedCams];

        if (over.id === "dropzone") {
            newCams = newCams.filter((cam) => cam.id !== draggedCamera.id);

            if (!newSelectedCams.find((cam) => cam.id === draggedCamera.id)) {
                newSelectedCams.push(draggedCamera);
            }
        } else {
            newSelectedCams = newSelectedCams.filter((cam) => cam.id !== draggedCamera.id);

            if (!newCams.find((cam) => cam.id === draggedCamera.id)) {
                newCams.push(draggedCamera);
            }
        }

        updateCameras(newCams, newSelectedCams);
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        if (!active) return;

        const camera = [...cams, ...selectedCams].find((cam) => String(cam.id) === active.id);
        setActiveDragCamera(camera);
    };

    return (
        <>
            <Header />

            <main className="flex flex-col lg:flex-row items-center gap-6 w-screen mt-3 px-20">
                {user !== "Lucas" && <VideoArea />}

                <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                    <div className="grid grid-cols-2 gap-4 mb-12 w-full">
                        <DropZone selectedCams={selectedCams} setCams={setCams} cams={cams} />
                        {user !== "Arthur" && <CamBoard cams={cams} />}
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
