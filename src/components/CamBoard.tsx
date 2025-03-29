import { useState } from "react";
import { Camera } from "@/types/Camera";
import { CiSearch } from "react-icons/ci";
import { CameraItem } from "./CameraItem";  // Ajuste o caminho conforme necessário
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

type Props = {
  cams: Camera[];
  setCurrentVideo: (link: string) => void;
};

export const CamBoard = ({ cams, setCurrentVideo }: Props) => {
  // Estado para armazenar o valor digitado no input
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtra as câmeras pela keyword com base no que está sendo digitado
  const filteredCams = cams.filter((cam) =>
    cam.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full overflow-y-auto bg-[#6495ed] rounded-lg">
      <div className=" px-4 pt-4 max-h-[500px] ">
        {/* Campo de pesquisa */}
        <div className="flex items-center bg-amber-100 rounded-md p-1 pl-3 mb-4">
          <input
            type="text"
            className="outline-0 border-none flex-1"
            placeholder="Pesquisar câmeras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}  // Atualiza o valor de searchQuery
          />
          <CiSearch />
        </div>

        {/* Lista de câmeras filtradas */}
        <div className="flex flex-col gap-6">
          <SortableContext items={filteredCams.map((item) => String(item.id))} strategy={verticalListSortingStrategy}>
            {filteredCams.map((item) => (
              <div key={item.id} onClick={() => setCurrentVideo(item.url)}>
                <CameraItem data={item} setPlay={setCurrentVideo} />
              </div>
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};
