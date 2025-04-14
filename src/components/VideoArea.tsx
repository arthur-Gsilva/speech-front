'use client'

import useSpeechRecognition from "@/libs/speech/useVoiceRecogninition";
import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { cameras } from "@/data/cameras";
import { useActiveCamera } from "@/contexts/CamContext";

// ICONS
import { FaMicrophoneAlt, FaMicrophoneAltSlash } from "react-icons/fa";
import { TbPictureInPictureFilled } from "react-icons/tb";
import { IoVideocam, IoVideocamOff } from "react-icons/io5";



export const VideoArea = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [recording, setRecording] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const { activeCamera, setActiveCamera } = useActiveCamera();
    const [found, setFound] = useState<boolean | null>(null)
    
    const [isDragging, ] = useState(false);

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

        setFound(null)
    }, [found]);

    useEffect(() => {
        if (!activeCamera) {
            setVideoUrl(null);
            return;
        }
        if (activeCamera === videoUrl) return;

        setVideoUrl(activeCamera);
    }, [activeCamera]);

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


    const { isListening } = useSpeechRecognition(recording, setFound);

    //@ts-expect-error só pra evitar warning no build
    if (isListening === 'asdasd') console.log("teste");

    const handleCam = async () => {
        if (videoRef.current) {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            }
            videoRef.current.pause();
            videoRef.current.removeAttribute("src");
            videoRef.current.load();
        }
        setActiveCamera(null);
    };

    const handlePictureInPicture = async () => {
        const video = videoRef.current;
        if (!video) return;

        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                await video.requestPictureInPicture();
            }
        } catch (error) {
            console.error("Erro ao alternar PiP:", error);
        }
    };

    const activeCam = cameras.filter((camera) => (
        camera.url === activeCamera
    ));

    return (
        <div className="w-2/3 h-full flex flex-col gap-4">
            <div
                className="overflow-hidden h-full w-full border rounded-lg border-[#07A6FF] relative"
            >
                <video
                    ref={videoRef}
                    autoPlay
                    className={`pointer-events-none select-none object-cover w-full h-full transition-opacity duration-500 ease-in-out`}
                    style={{
                        transformOrigin: "center center",
                        transition: isDragging ? "none" : "transform 0.2s ease-out",
                    }}
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
                    style={{ backgroundColor: recording ? "gray" : "#38B000" }}
                    onClick={() => setRecording(!recording)}
                >
                    {recording ? <FaMicrophoneAltSlash /> : <FaMicrophoneAlt />}
                </button>

                <button
                    className="p-4 text-white rounded-full cursor-pointer text-xl"
                    style={{ backgroundColor: activeCamera ? "gray" : "red" }}
                    onClick={handleCam}
                >
                    {activeCamera ? <IoVideocamOff /> : <IoVideocam />}
                </button>

                <button
                    className="p-4 bg-white rounded-full cursor-pointer text-xl text-[#718096] border border-[#07A6FF]"
                    onClick={handlePictureInPicture}
                >
                    <TbPictureInPictureFilled />
                </button>
            </div>

            <ToastContainer />
        </div>
    );
};
