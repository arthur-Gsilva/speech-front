import { useEffect, useState } from "react";
import socket from "@/libs/socket";
import { Camera } from "@/types/Camera";

export const useCamerasSocket = () => {
  const [cams, setCams] = useState<Camera[]>([]);
  const [selectedCams, setSelectedCams] = useState<Camera[]>([]);

  useEffect(() => {
    const handleInit = (data: { cams: Camera[]; selectedCams: Camera[] }) => {
      setCams(data.cams);
      setSelectedCams(data.selectedCams);
    };

    const handleUpdate = (data: { cams: Camera[]; selectedCams: Camera[] }) => {
      setCams(data.cams);
      setSelectedCams(data.selectedCams);
    };

    if (socket.connected) {
      socket.emit("request-cameras");
    } else {
      socket.once("connect", () => {
        socket.emit("request-cameras");
      });
    }

    socket.on("init-cameras", handleInit);
    socket.on("update-cameras", handleUpdate);

    return () => {
      socket.off("init-cameras", handleInit);
      socket.off("update-cameras", handleUpdate);
    };
  }, []);

  const updateCameras = (newCams: Camera[], newSelectedCams: Camera[]) => {
    setCams(newCams);
    setSelectedCams(newSelectedCams);
    socket.emit("move-camera", { cams: newCams, selectedCams: newSelectedCams });
  };

  return { cams, selectedCams, updateCameras };
};
