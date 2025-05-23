'use client';

import useSpeechRecognition from "@/libs/speech/useVoiceRecogninition";
import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { cameras } from "@/data/cameras";
import { useActiveCamera } from "@/contexts/CamContext";
import socket from "@/libs/socket"; 
// ICONS
import { FaMicrophoneAlt, FaMicrophoneAltSlash } from "react-icons/fa";
import { IoVideocam, IoVideocamOff } from "react-icons/io5";
import { LuFullscreen } from "react-icons/lu";
import { LockButton } from "./LockButton";
import { useLock } from "@/contexts/LockContext";

export const VideoArea = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [recording, setRecording] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const { activeCamera, setActiveCamera } = useActiveCamera();
    const [found, setFound] = useState<boolean | null>(null);
    const [isDragging, ] = useState(false);

    const { locked } = useLock();

    useEffect(() => {
        if (found === true) {
            toast.success("Câmera encontrada com sucesso!", {
                position: "top-right",
                autoClose: 3000,
            });
        } else if (found === false) {
            toast.error("Nenhuma câmera foi encontrada!", {
                position: "top-right",
                autoClose: 3000,
            });
        }
        setFound(null);
    }, [found]);

    useEffect(() => {
        if (!activeCamera) {
            setVideoUrl(null);
            return;
        }
        if (activeCamera === videoUrl) return;

        setVideoUrl(activeCamera);
        const bc = new BroadcastChannel("camera-sync");
        bc.postMessage(activeCamera);
        bc.close();
        socket.emit('change-camera', { url: activeCamera }); 
    }, [activeCamera]);

    // RECEBE ATUALIZAÇÃO DO SOCKET
    useEffect(() => {
        socket.on('camera-updated', ({  url }) => {
            setActiveCamera(url);
        });

        return () => {
            socket.off('camera-updated');
        };
    }, []);

    // Troca o vídeo
    useEffect(() => {
        let hls: Hls | null = null;

        if (videoUrl && videoRef.current) {
            const video = videoRef.current;

            if (Hls.isSupported()) {
                hls = new Hls();
                hls.loadSource(videoUrl);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.muted = true;
                    video.play().catch((error) => console.error("Erro ao iniciar vídeo:", error));
                });
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = videoUrl;
                video.muted = true;
                video.play().catch((error) => console.error("Erro ao iniciar vídeo:", error));
            }
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.removeAttribute("src");
                videoRef.current.load();
            }
            if (hls) hls.destroy();
        };
    }, [videoUrl]);


    //ATIVAR O MIC APERTANDO Q
    useEffect(() => {
        
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key.toLowerCase() === "q") {
            setRecording(true);
          }
        };
    
        const handleKeyUp = (e: KeyboardEvent) => {
          if (e.key.toLowerCase() === "q") {
            
            setRecording(false);
          }
        };
    
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
    
        return () => {
          window.removeEventListener("keydown", handleKeyDown);
          window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);


    const { isListening } = useSpeechRecognition(recording, setFound);

    //@ts-expect-error só pra evitar warning no build
    if (isListening === 'asdasd') console.log("teste");

    const handleCam = async () => {
        setActiveCamera("/main.m3u8");
        socket.emit('change-camera', { url: "/main.m3u8" });
    };

    const handleFullscreen = async () => {
        
        if(locked){
            toast.error("Você não pode abrir outra guia com o sistema bloqueado!", {
                position: "top-right",
                autoClose: 3000,
            });
        } else{
            if (!videoUrl) return;
            const encoded = encodeURIComponent(videoUrl);
            window.open(`/player?cam=${encoded}`, '_blank');
        }
    };

    const handleRecording = () => {
        if(locked){
            toast.error("Você não pode ativar a voz com o sistema bloqueado!", {
                position: "top-right",
                autoClose: 3000,
            });
        } else{
            setRecording(!recording)
        }
    }

    const activeCam = cameras.filter((camera) => (
        camera.url === activeCamera
    ));

    return (
        <div className="w-2/3 h-full flex flex-col gap-4">
            <div className="overflow-hidden h-full w-full border rounded-lg border-[#07A6FF] relative">
                <video
                    ref={videoRef}
                    autoPlay
                    className={`pointer-events-none select-none object-cover w-full h-full transition-opacity duration-500 ease-in-out`}
                    style={{
                        transformOrigin: "center center",
                        transition: isDragging ? "none" : "transform 0.2s ease-out",
                    }}
                    controls={videoUrl ? undefined : false}
                />
            </div>

            {activeCam[0] && (
                <div className="py-2 bg-white rounded-md text-center text-lg border border-[#07A6FF] font-bold">
                    <p>{activeCam[0].address}</p>
                </div>
            )}

            <div className="flex gap-5 justify-center">
                <button
                    className="p-4 text-white rounded-full cursor-pointer text-xl"
                    style={{ backgroundColor: !recording ? "gray" : "#38B000" }}
                    onClick={handleRecording}
                >
                    {recording ?  <FaMicrophoneAlt /> : <FaMicrophoneAltSlash />}
                </button>

                <button
                    className="p-4 text-white rounded-full cursor-pointer text-xl"
                    style={{ backgroundColor: !activeCamera ? "gray" : "red" }}
                    onClick={handleCam}
                >
                    {activeCamera ? <IoVideocam /> :  <IoVideocamOff />}
                </button>

                <button
                    className="p-4 bg-white rounded-full cursor-pointer text-xl text-[#718096] border border-[#07A6FF]"
                    onClick={handleFullscreen} 
                >
                    <LuFullscreen />
                </button>
            </div>

            <LockButton />

            {!locked &&
                <p className="text-center">Ou pressione a letra <strong>Q</strong></p>
            }
        
            <ToastContainer />
        </div>
    );
};