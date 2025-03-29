import { Camera } from "@/types/Camera";
import { BiCameraHome } from "react-icons/bi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useCallback } from "react";
import { DndContext, DragStartEvent, DragEndEvent } from "@dnd-kit/core";

type Props = {
  data: Camera;
  setPlay: (link: string) => void;
};

export const CameraItem = ({ data, setPlay }: Props) => {
  const [isDragging, setIsDragging] = useState(false);  // Flag para detectar se o item está sendo arrastado

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: String(data.id),
  });

  const handleClick = useCallback(() => {
    if (!isDragging) {
      setPlay(data.url);
    }

    console.log(data.url)
  }, [isDragging, data.url, setPlay]);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      className="flex items-center gap-4 bg-white p-2 rounded-md text-black cursor-pointer"
      onClick={handleClick}  // Usando o handleClick para evitar conflito com o arrasto
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      <div>
        <BiCameraHome className="text-2xl" />
      </div>
      <div>
        <h3 className="text-2xl">{data.keyword}</h3>
        <h5 className="text-xs text-gray-800">{data.address}</h5>
      </div>
    </div>
  );
};