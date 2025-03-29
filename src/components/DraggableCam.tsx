"use client";

import { CameraItem } from "@/components/CameraItem";
import { Camera } from "@/types/Camera";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useState } from "react";

type Props = {
  cameras: Camera[];
  setCurrentVideo: (url: string | null) => void;
};

const DraggableCameras = ({ cameras, setCurrentVideo }: Props) => {
  const [availableCameras, setAvailableCameras] = useState<Camera[]>(cameras);
  const [selectedCameras, setSelectedCameras] = useState<Camera[]>([]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const draggedCamera = availableCameras.find((cam) => String(cam.id) === draggableId);
    if (!draggedCamera) return;

    if (destination.droppableId === "drop-area") {
      setAvailableCameras((prev) => prev.filter((cam) => String(cam.id) !== draggableId));
      setSelectedCameras((prev) => [...prev, draggedCamera]);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6">
        {/* Área Droppable */}
        <Droppable droppableId="drop-area">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="bg-amber-400 p-2 text-center w-full max-h-[500px] overflow-hidden overflow-y-auto">
              <p>Adicione aqui as câmeras</p>
              {selectedCameras.map((item, index) => (
                <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="cursor-grab">
                      <CameraItem data={item} setPlay={setCurrentVideo} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Lista de Câmeras Disponíveis */}
        <Droppable droppableId="available-cameras">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-6">
              {availableCameras.map((item, index) => (
                <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="cursor-grab">
                      <CameraItem data={item} setPlay={setCurrentVideo} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default DraggableCameras;
