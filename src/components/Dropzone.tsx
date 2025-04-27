import { Camera } from "@/types/Camera";
import { useDroppable } from "@dnd-kit/core";
import { CameraItem } from "./CameraItem";
import { HeaderZone } from "./ZoneHeader";
import { useActiveCamera } from "@/contexts/CamContext";
import { useEffect, useState } from "react";
import socket from "@/libs/socket";

type Props = {
    selectedCams: Camera[],
    setSelectedCams: (cam: Camera[]) => void,
    setCams: (cam: Camera[]) => void,
    cams: Camera[],
}

export const DropZone = ({ selectedCams, setSelectedCams, setCams, cams }: Props) => {
    const { setNodeRef } = useDroppable({ id: "dropzone" });

    const { activeCamera, setActiveCamera } = useActiveCamera();
    const [viewedCameras, setViewedCameras] = useState<string[]>([]);

    useEffect(() => {
        if (activeCamera && !viewedCameras.includes(activeCamera)) {
            setViewedCameras((prev) => [...prev, activeCamera]);
        }
    }, [activeCamera]);

    const handleClick = () => {
        const updatedCams = cams.concat(selectedCams); // Junta as câmeras de volta
        const updatedSelectedCams: Camera[] = []; // Limpa a seleção
      
        // Atualiza localmente (pra ficar rápido no clique)
        setCams(updatedCams);
        setSelectedCams(updatedSelectedCams);
        setViewedCameras([]);
      
        // Emite para o servidor (pra todo mundo sincronizar)
        socket.emit("move-camera", { cams: updatedCams, selectedCams: updatedSelectedCams });
      };

    return (
        <div ref={setNodeRef} className="zone mt-12">
            <HeaderZone title="Câmeras da Transmissão" label="Status"/>

            {selectedCams.map((item) => (
                <div 
                    onClick={() => setActiveCamera(item.url)} 
                    key={item.id} 
                    className={`
                        mb-2 transition-opacity duration-300
                        ${viewedCameras.includes(item.url) && item.url !== activeCamera ? 'opacity-40' : 'opacity-100'}
                      `}
                >
                    <CameraItem  data={item} Drag={true}>
                        <button className={`${item.url === activeCamera ? 'bg-[#38B000]' : 'bg-[#CED4DA]'} px-3 py-1 rounded-md text-white`}>
                            {item.url !== activeCamera &&
                                <p>Offline</p>
                            }
                            {item.url === activeCamera &&
                                <p>Online</p>
                            }
                        </button>
                    </CameraItem>
                </div>
            ))}

            {selectedCams.length >= 1 &&
                <div className="w-full flex justify-center items-center">
                    <button 
                        className="bg-white p-2 rounded-lg text-black cursor-pointer mt-4"
                        onClick={handleClick}
                    >Limpar</button>
                </div>
            }
        </div>
    );
};
