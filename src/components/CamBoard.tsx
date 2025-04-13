import { useState } from "react";
import { Camera } from "@/types/Camera";
import { CiSearch } from "react-icons/ci";
import { CameraItem } from "./CameraItem";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { formattIdCam } from "@/services/useFormatter";
import { HeaderZone } from "./ZoneHeader";
import { useActiveCamera } from "@/contexts/CamContext";

type Props = {
  cams: Camera[];
};

export const CamBoard = ({ cams }: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { setActiveCamera } = useActiveCamera();

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

      <div className="zone">
        <HeaderZone title="Câmeras Disponíveis" label="Lista"/>

        <div className="flex flex-col gap-6">
          {filteredCams.length > 0 &&
            <SortableContext items={filteredCams.map((item) => String(item.id))} strategy={verticalListSortingStrategy}>
            {filteredCams.map((item) => (
              <div key={item.id} onClick={() => setActiveCamera(item.url)}>
                <CameraItem data={item} setPlay={setActiveCamera}>
                <div className="bg-[#07A6FF] px-8 font-bold py-2 rounded-lg text-white">
                  {formattIdCam(item.id)}
                </div>
                </CameraItem>
              </div>
            ))}
          </SortableContext>
          }

          {filteredCams.length === 0 &&
            <h4 className="text-center mt-3 text-gray-600">Nenhuma câmera encontrada</h4>
          }
          
        </div>
      </div>
    </div>
  );
};
