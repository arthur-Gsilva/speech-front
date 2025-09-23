import { useEffect, useState } from "react";
import { Camera } from "@/types/Camera";
import { CiSearch } from "react-icons/ci";
import { CameraItem } from "./CameraItem";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { formattIdCam } from "@/services/useFormatter";
import { HeaderZone } from "./ZoneHeader";
import { useActiveCamera } from "@/contexts/CamContext";
import { checkCameraStatus } from "@/utils/checkCam";
import { VideoPreview } from "./VideoPreview";

type Props = {
  cams: Camera[];
};

const CACHE_TTL_MS = 30_000; // 30s

function getCacheKey(url: string) {
  return `cam_status:${url}`;
}

async function checkAll(urls: string[]): Promise<Record<string, boolean>> {
  const promises = urls.map((u) =>
    checkCameraStatus(u)
      .then((r) => ({ u, r }))
      .catch(() => ({ u, r: false }))
  );

  const resolved = await Promise.all(promises);
  const result: Record<string, boolean> = {};

  resolved.forEach(({ u, r }) => {
    result[u] = r;
    try {
      sessionStorage.setItem(
        getCacheKey(u),
        JSON.stringify({ ok: r, t: Date.now() })
      );
    } catch {}
  });

  return result;
}

export const CamBoard = ({ cams }: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hoveredCamUrl, setHoveredCamUrl] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [statusMap, setStatusMap] = useState<Record<string, boolean>>({});

  const { setActiveCamera } = useActiveCamera();

  const handleMouseEnter = (e: React.MouseEvent, url: string) => {
    const { clientX, clientY } = e;
    setMousePosition({ x: clientX, y: clientY });
    setHoveredCamUrl(url);
  };

  const filteredCams = cams
    .filter((cam) =>
      cam.keyword.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);

  useEffect(() => {
    let mounted = true;

    const checkStatuses = async () => {
      const urls = cams.map((c) => c.url);

      const cachedResults: Record<string, boolean> = {};
      const toCheck: string[] = [];

      for (const url of urls) {
        try {
          const raw = sessionStorage.getItem(getCacheKey(url));
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.t && Date.now() - parsed.t < CACHE_TTL_MS) {
              cachedResults[url] = parsed.ok;
              continue;
            }
          }
        } catch {}

        toCheck.push(url);
      }

      if (mounted) setStatusMap((prev) => ({ ...prev, ...cachedResults }));

      if (toCheck.length > 0) {
        const checked = await checkAll(toCheck);
        if (mounted) setStatusMap((prev) => ({ ...prev, ...checked }));
      }
    };

    checkStatuses();

    return () => {
      mounted = false;
    };
  }, [cams]); 

  return (
    <div className="w-full h-full rounded-lg">
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
        <HeaderZone title="Câmeras Disponíveis" label="Lista" />

        <div className="flex flex-col gap-6">
          <SortableContext
            items={filteredCams.map((item) => String(item.id))}
            strategy={verticalListSortingStrategy}
          >
            {filteredCams.map((item) => (
              <div
                key={item.id}
                onMouseEnter={(e) => handleMouseEnter(e, item.url)}
                onMouseLeave={() => setHoveredCamUrl(null)}
              >
                <CameraItem data={item} setPlay={setActiveCamera}>
                  <div
                    className={`px-4 lg:px-8 font-bold py-2 rounded-lg text-white ${
                      statusMap[item.url] ? "bg-[#07A6FF]" : "bg-red-500"
                    }`}
                  >
                    {formattIdCam(item.id)}{" "}
                  </div>
                </CameraItem>

                <VideoPreview
                  url={hoveredCamUrl ?? ""}
                  visible={!!hoveredCamUrl}
                  position={mousePosition}
                />
              </div>
            ))}
          </SortableContext>

          {filteredCams.length === 0 && (
            <h4 className="text-center mt-3 text-gray-600">
              Nenhuma câmera encontrada
            </h4>
          )}
        </div>
      </div>
    </div>
  );
};
