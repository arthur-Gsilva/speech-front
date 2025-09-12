// hooks/useCameraSocket.ts
import { useEffect, useState } from "react";
import socket from "@/libs/socket";
import { cameras } from "@/data/cameras"; // fonte de dados fixa no front
import { Camera } from "@/types/Camera";

export const useCamerasSocket = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    socket.on("init-selected-ids", (ids: number[]) => {
      setSelectedIds(ids);
    });

    socket.on("update-selected-ids", (ids: number[]) => {
      setSelectedIds(ids);
    });

    return () => {
      socket.off("init-selected-ids");
      socket.off("update-selected-ids");
    };
  }, []);

  // Computa as câmeras locais com base nos IDs recebidos
  const selectedCams = cameras.filter((cam) => selectedIds.includes(cam.id));
  const availableCams = cameras.filter((cam) => !selectedIds.includes(cam.id));

  const updateSelectedCams = (newSelected: Camera[]) => {
    const ids = newSelected.map((cam) => cam.id);
    setSelectedIds(ids);
    socket.emit("update-selected-ids", ids);
  };

  return { availableCams, selectedCams, updateSelectedCams };
};
