import { Camera } from "@/types/Camera";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode } from "react";
import { formattIdCam } from "@/services/useFormatter";
import Image from "next/image";

type Props = {
  data: Camera;
  setPlay?: (link: string) => void;
  children: ReactNode;
  Drag?: boolean;
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
      ref={!Drag ? setNodeRef : undefined}
      {...(!Drag ? attributes : {})}
      {...(!Drag ? listeners : {})}
      style={!Drag ? style : undefined}
      className="flex items-center justify-between gap-4 bg-white rounded-md text-black cursor-pointer border-b border-b-gray-200 pb-3 px-3"
    >
      <div className="flex items-center gap-4">
        <div>
          <Image src="/globo-icon.png" alt="icon da globo" width={32} height={32} />
        </div>
        <div>
          <h3 className="text-lg lg:text-2xl text-[#2D3748] font-bold">{data.keyword}</h3>
          <h5 className="text-[#718096]">Câmera {formattIdCam(data.id)}</h5>
        </div>
      </div>

      {children}
    </div>
  );
};
