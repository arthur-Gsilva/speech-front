// PlayerClient.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Hls from 'hls.js';

export default function PlayerClient() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const searchParams = useSearchParams();
    const initialCameraUrl = searchParams.get('cam');
    const [cameraUrl, setCameraUrl] = useState<string | null>(initialCameraUrl);
    const hlsRef = useRef<Hls | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !cameraUrl) return;

        const playStream = (url: string) => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }

            if (Hls.isSupported()) {
                const hls = new Hls();
                hlsRef.current = hls;

                hls.loadSource(url);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play()
                        .then(() => {
                            if (!document.fullscreenElement) {
                                video.requestFullscreen().catch(() => {});
                            }
                        })
                        .catch(console.error);
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
                video.play().catch(console.error);
            }
        };

        playStream(cameraUrl);

        return () => {
            hlsRef.current?.destroy();
        };
    }, [cameraUrl]);

    useEffect(() => {
        const bc = new BroadcastChannel("camera-sync");
        bc.onmessage = (event) => {
            if (typeof event.data === 'string') {
                setCameraUrl(event.data);
            }
        };

        return () => {
            bc.close();
        };
    }, []);

    if (!cameraUrl) {
        return <div className="text-center text-red-600 p-10">URL da câmera não encontrada.</div>;
    }

    return (
        <div className="w-screen h-screen bg-black flex items-center justify-center">
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                controls={false}
            />
        </div>
    );
}
