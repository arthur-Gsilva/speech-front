import { Camera } from "@/types/Camera";
import { useDroppable } from "@dnd-kit/core";
import { CameraItem } from "./CameraItem";

type Props = {
    selectedCams: Camera[],
    setCurrentVideo: (video: string) => void,
    currentVideo: string | null,
    setSelectedCams: (cam: Camera[]) => void,
    setCams: (cam: Camera[]) => void,
    cams: Camera[]
}

export const DropZone = ({ selectedCams, setCurrentVideo, currentVideo, setSelectedCams, setCams, cams }: Props) => {
    const { setNodeRef } = useDroppable({ id: "dropzone" });

    const handleClick = () => {
        setCams(cams.concat(selectedCams))
        setSelectedCams([])
    }

    return (
        <div ref={setNodeRef} className="bg-white border border-[#07A6FF] p-4 rounded-lg min-h-[500px] mt-12">
            <div className="flex justify-between items-center border-b border-b-gray-200 pb-3 mb-2">
                <h5 className="text-[#2D3748] text-xl font-bold">Câmeras da Transmissão</h5>
                <p className="text-[#6C757D] pr-8">Status</p>
            </div>

            {selectedCams.map((item) => (
            // <div 
            //     className="bg-white p-2 mt-2 rounded shadow cursor-pointer"
            //     key={item.id} 
            //     style={{ backgroundColor: item.url ===  currentVideo && currentVideo ? 'green' : '#fff'}}
            //     onClick={() => setCurrentVideo(item.url)}>
            //     {item.keyword}
            // </div>
                <div onClick={() => setCurrentVideo(item.url)} key={item.id} className="mb-2">
                    <CameraItem  data={item} Drag={true}>
                        <button className={`${item.url === currentVideo ? 'bg-[#38B000]' : 'bg-[#CED4DA]'} px-3 py-1 rounded-md text-white`}>
                            {item.url !== currentVideo &&
                                <p>Offline</p>
                            }
                            {item.url === currentVideo &&
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
