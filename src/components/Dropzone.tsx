import { Camera } from "@/types/Camera";
import { useDroppable } from "@dnd-kit/core";
import { CameraItem } from "./CameraItem";
import { HeaderZone } from "./ZoneHeader";
import { useActiveCamera } from "@/contexts/CamContext";
import { useEffect, useState } from "react";
import socket from "@/libs/socket";

type Props = {
    selectedCams: Camera[],
    setCams: (cam: Camera[]) => void,
    cams: Camera[],
}

export const DropZone = ({ selectedCams, setCams, cams }: Props) => {
    const { setNodeRef } = useDroppable({ id: "dropzone" });
    const { activeCamera, setActiveCamera } = useActiveCamera();
    const [viewedCameras, setViewedCameras] = useState<string[]>([]);

    useEffect(() => {
        if (activeCamera && !viewedCameras.includes(activeCamera)) {
            setViewedCameras((prev) => [...prev, activeCamera]);
        }
    }, [activeCamera]);

    const handleClick = () => {
        // Limpa todas as câmeras selecionadas
        const updatedCams = cams.concat(selectedCams);
        setCams(updatedCams);

        // Emite o estado atualizado para o servidor
        socket.emit("move-camera", { cams: updatedCams, selectedCams: [] });
    };

    const removeCam = (id: number) => {
        // Remove a câmera da lista selecionada e adiciona na lista principal
        const updatedSelectedCams = selectedCams.filter((cam) => cam.id !== id);
        const updatedCams = [...cams, ...selectedCams.filter((cam) => cam.id === id)];

        setCams(updatedCams);

        // Emite o estado atualizado para o servidor
        socket.emit("move-camera", { cams: updatedCams, selectedCams: updatedSelectedCams });
    };

    return (
        <div ref={setNodeRef} className="zone mt-12">
            <HeaderZone title="Câmeras da Transmissão" label="Status" />

            {selectedCams.map((item) => (
                <div 
                    key={item.id}
                    className={`
                    relative mb-2 transition-opacity duration-300 group overflow-hidden
                    ${viewedCameras.includes(item.url) && item.url !== activeCamera ? 'opacity-40' : 'opacity-100'}
                    `}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            removeCam(item.id);
                        }}
                        className="top-[-100%] group-hover:top-0 transition-all duration-300 absolute right-2 bg-red-600 h-8 w-8 rounded-full text-white font-bold text-xl z-10 cursor-pointer hover:bg-red-800"
                    >
                        ×
                    </button>

                    <div onClick={() => setActiveCamera(item.url)}>
                        <CameraItem data={item} Drag={true}>
                            <button className={`${item.url === activeCamera ? 'bg-[#38B000]' : 'bg-[#CED4DA]'} px-3 py-1 rounded-md text-white`}>
                                {item.url === activeCamera ? <p>Online</p> : <p>Offline</p>}
                            </button>
                        </CameraItem>
                    </div>
                </div>
            ))}

            {selectedCams.length >= 1 && (
                <div className="w-full flex justify-center items-center">
                    <button 
                        className="bg-white p-2 rounded-lg text-black cursor-pointer mt-4"
                        onClick={handleClick}
                    >
                        Limpar
                    </button>
                </div>
            )}
        </div>
    );
};
