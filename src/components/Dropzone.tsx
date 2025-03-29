import { Camera } from "@/types/Camera";
import { useDroppable } from "@dnd-kit/core";

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
        <div ref={setNodeRef} className="bg-[#6495ed] p-4 rounded-lg min-h-[500px] ">
            <h2 className="text-center">Adicione aqui as câmeras</h2>

            {selectedCams.map((item) => (
            <div 
                className="bg-white p-2 mt-2 rounded shadow cursor-pointer" key={item.id} 
                style={{ backgroundColor: item.url ===  currentVideo && currentVideo ? 'green' : '#fff'}}
                onClick={() => setCurrentVideo(item.url)}>
                {item.keyword}
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
