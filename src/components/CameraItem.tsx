import { Camera } from "@/types/Camera";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";
import { formattIdCam } from "@/services/useFormatter";

type Props = {
  data: Camera;
  setPlay?: (link: string) => void;
  children: ReactNode,
  Drag?: boolean
};

export const CameraItem = ({ data, children, Drag }: Props) => {
  
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: String(data.id),
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div
            className="flex items-center justify-between gap-4 bg-white rounded-md text-black cursor-pointer border-b border-b-gray-200 pb-3 px-3"
            {...(!Drag && {
                ref: setNodeRef,
                ...attributes,
                ...listeners,
                style: style,
              })}
        >
            <div className="flex items-center gap-4">
                <div>
                    <img src="./globo-icon.png" alt="icon da globo" />
                </div>
                <div>
                    <h3 className="text-2xl text-[#2D3748] font-bold">Câmera {formattIdCam(data.id)}</h3>
                    <h5 className=" text-[#718096]">{data.keyword}</h5>
                </div>
            </div>

            

            {children}
        </div>
    );
};