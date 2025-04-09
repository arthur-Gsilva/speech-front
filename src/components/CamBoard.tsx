import { useState } from "react";
import { Camera } from "@/types/Camera";
import { CiSearch } from "react-icons/ci";
import { CameraItem } from "./CameraItem";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { formattIdCam } from "@/services/useFormatter";

type Props = {
  cams: Camera[];
  setCurrentVideo: (link: string) => void;
};

export const CamBoard = ({ cams, setCurrentVideo }: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCams = cams
  .filter((cam) =>
    cam.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => a.id - b.id);

  return (
    <div className="w-full h-full  rounded-lg">
      <div className="flex items-center bg-white border border-[#07A6FF] rounded-lg p-1 pl-3 mb-4 gap-4">
          <CiSearch />

          <input
            type="text"
            className="outline-0 border-none flex-1"
            placeholder="Pesquisar câmeras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}  
          />
          
      </div>

      <div className="bg-white border border-[#07A6FF] overflow-y-auto p-4 max-h-[500px] min-w-[400px] rounded-md">
        
        <div className="flex justify-between items-center border-b border-b-gray-200 pb-3 mb-2">
          <h5 className="text-[#2D3748] text-xl font-bold">Câmeras disponíveis</h5>
          <p className="text-[#6C757D] pr-8">Lista</p>
        </div>

        <div className="flex flex-col gap-6">
          <SortableContext items={filteredCams.map((item) => String(item.id))} strategy={verticalListSortingStrategy}>
            {filteredCams.map((item) => (
              <div key={item.id} onClick={() => setCurrentVideo(item.url)}>
                <CameraItem data={item} setPlay={setCurrentVideo}>
                <div className="bg-[#07A6FF] px-8 font-bold py-2 rounded-lg text-white">
                  {formattIdCam(item.id)}
                </div>
                </CameraItem>
              </div>
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};
